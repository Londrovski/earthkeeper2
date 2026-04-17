const { configure } = require('quasar/wrappers')

module.exports = configure(function () {
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
