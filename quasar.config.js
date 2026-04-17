import { configure } from 'quasar/wrappers'

export default configure(function (/* ctx */) {
  return {
    eslint: {
      warnings: true,
      errors: true
    },

    boot: [
      'maplibre',
      'github-api'
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'material-icons',
      'material-icons-outlined'
    ],

    build: {
      target: {
        browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
        node: 'node20'
      },

      vueRouterMode: 'hash', // available values: 'hash', 'history'
      
      env: {
        GITHUB_TOKEN_PART1: 'ghp_KcWJhRHBiDNttiIcY5N',
        GITHUB_TOKEN_PART2: 'XE23u4hbGqL3coy1n',
        PASSWORD_HASH: '74e6fbb572af72246abf610d8e268ae53e6599972c571117503dc4537b982b69'
      }
    },

    devServer: {
      open: true
    },

    framework: {
      config: {
        dark: true,
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
      },

      plugins: [
        'Notify',
        'Dialog',
        'Loading',
        'LocalStorage',
        'Platform',
        'Geolocation'
      ]
    },

    animations: 'all',

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: [
        'render'
      ]
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      manifest: {
        name: 'Earthkeeper',
        short_name: 'Earthkeeper',
        description: 'UK Energy Clearing Tracker',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0D2416',
        theme_color: '#C9A84C',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager',
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
      },
      builder: {
        // https://www.electron.build/configuration/configuration
        appId: 'uk.earthkeeper.app'
      }
    },

    bex: {
      contentScripts: [
        'my-content-script'
      ]
    }
  }
})
