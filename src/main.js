import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'
import router from './router'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  config: {
    brand: {
      primary: '#C9A84C',
      secondary: '#0D2416',
      accent: '#E8D5A0',
      dark: '#0D2416',
      'dark-page': '#0D2416',
      positive: '#4A9B6F',
      negative: '#E07050',
      info: '#5B9BD5',
      warning: '#C4722A'
    }
  }
})

const pinia = createPinia()
myApp.use(pinia)
myApp.use(router)

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')