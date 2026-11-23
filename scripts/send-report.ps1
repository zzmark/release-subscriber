[CmdletBinding(DefaultParameterSetName='Send')]
param(
    [Parameter(Mandatory, ParameterSetName='Check')][switch]$CheckAuth,
    [Parameter(Mandatory, ParameterSetName='Send')][string]$Report,
    [Parameter(Mandatory, ParameterSetName='Send')][string]$Subject
)
$ErrorActionPreference = 'Stop'
$mailDir = Join-Path $env:LOCALAPPDATA 'release-subscriber'
$credential = Import-Clixml -LiteralPath (Join-Path $mailDir 'smtp.credential.xml')
$arguments = @((Join-Path $PSScriptRoot 'smtp_report.py'), $mailDir)
if (!$CheckAuth) { $arguments += @((Resolve-Path -LiteralPath $Report).Path, $Subject) }
$OutputEncoding = [Text.UTF8Encoding]::new($false)
$credential.GetNetworkCredential().Password | python -X utf8 @arguments
exit $LASTEXITCODE
