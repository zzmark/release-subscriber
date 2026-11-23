"""Called by send-report.ps1. The password arrives through a private stdin pipe."""
import hashlib
import json
import smtplib
import ssl
import sys
from email.message import EmailMessage
from email.utils import formataddr, formatdate, make_msgid
from pathlib import Path


def main():
    directory = Path(sys.argv[1])
    config = json.loads((directory / "smtp.json").read_text(encoding="utf-8-sig"))
    password = sys.stdin.readline().rstrip("\r\n")
    sender = config["SMTP_FROM"]
    with smtplib.SMTP_SSL(config["SMTP_HOST"], int(config["SMTP_PORT"]),
                          context=ssl.create_default_context(), timeout=30) as smtp:
        smtp.login(sender, password)
        if len(sys.argv) == 2:
            print("SMTP TLS and authentication passed.")
            return
        report, subject = sys.argv[2:]
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = formataddr((config["SMTP_FROM_NAME"], sender))
        msg["To"] = config["EMAIL"]
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain=sender.split("@")[-1])
        msg.set_content(Path(report).read_text(encoding="utf-8-sig"), subtype="html")
        key = hashlib.sha256((config["EMAIL"] + "\n" + subject).encode()).hexdigest()
        receipts = directory / "receipts"
        receipts.mkdir(exist_ok=True)
        receipt = receipts / key
        try:
            with receipt.open("x", encoding="utf-8") as file:
                file.write("pending confirmation: " + msg["Message-ID"])
        except FileExistsError:
            print(receipt.read_text(encoding="utf-8"))
            if not receipt.read_text(encoding="utf-8").startswith("accepted:"):
                raise SystemExit("Verify delivery before retrying.")
            return
        try:
            smtp.send_message(msg)
        except (smtplib.SMTPRecipientsRefused, smtplib.SMTPSenderRefused,
                smtplib.SMTPDataError):
            receipt.unlink()
            raise
        receipt.write_text("accepted: " + msg["Message-ID"], encoding="utf-8")
        print(receipt.read_text(encoding="utf-8"))


if __name__ == "__main__":
    main()
