import DefaultTheme from 'vitepress/theme'
import ReleaseCard from './ReleaseCard.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReleaseCard', ReleaseCard)
  }
}
