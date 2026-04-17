import { configure } from 'quasar/wrappers'

export default configure(() => {
  return {
    boot: [],
    
    css: [
      'app.scss'
    ],
    
    extras: [
      'material-icons'
    ],
    
    build: {
      vueRouterMode: 'hash'
    },
    
    devServer: {
      open: true
    },
    
    framework: {
      config: {
        dark: true
      },
      plugins: [
        'Notify'
      ]
    }
  }
})
