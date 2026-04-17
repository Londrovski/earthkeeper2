import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

// Password hash from original app (exact same)
const PASSWORD_HASH = '74e6fbb572af72246abf610d8e268ae53e6599972c571117503dc4537b982b69'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null,
    currentTool: 'MG',
    userHasEarthworks: false,
    isAuthenticated: false
  }),

  getters: {
    getUserInfo: (state) => ({
      name: state.currentUser,
      tool: state.currentTool,
      hasEarthworks: state.userHasEarthworks
    }),

    // Format tool display name
    toolDisplayName: (state) => {
      const toolNames = {
        'MS': 'Magical Structures (MS)',
        'MF': 'Multifrequency (MF)', 
        'O': 'Omega (O)',
        'J': 'Jewel (J)',
        'MG': 'Merlin\'s Grace (MG)',
        'AP': 'Universal AP (AP)',
        'MI': 'Manifesting Intention (MI)',
        'MJ': 'Magical Jewel (MJ)',
        'DM': 'Divine Magic (DM)'
      }
      return toolNames[state.currentTool] || state.currentTool
    }
  },

  actions: {
    async login(name, password, tool, hasEarthworks = false) {
      try {
        // Hash the password using Web Crypto API (same as original)
        const hash = await this.sha256(password)
        
        if (hash !== PASSWORD_HASH) {
          return false
        }

        // Store authentication data (same keys as original)
        this.currentUser = name
        this.currentTool = tool
        this.userHasEarthworks = hasEarthworks
        this.isAuthenticated = true

        // Persist to LocalStorage (same keys as original)
        LocalStorage.set('ek_user', name)
        LocalStorage.set('ek_tool', tool)
        LocalStorage.set('ek_ew', hasEarthworks ? '1' : '0')

        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    logout() {
      this.currentUser = null
      this.currentTool = 'MG'
      this.userHasEarthworks = false
      this.isAuthenticated = false

      // Clear LocalStorage (same keys as original)
      LocalStorage.remove('ek_user')
      LocalStorage.remove('ek_tool')
      LocalStorage.remove('ek_ew')
    },

    // Check for existing session on app startup (same as original)
    checkExistingSession() {
      const savedUser = LocalStorage.getItem('ek_user')
      const savedTool = LocalStorage.getItem('ek_tool')
      const savedEW = LocalStorage.getItem('ek_ew')

      if (savedUser) {
        this.currentUser = savedUser
        this.currentTool = savedTool || 'MG'
        this.userHasEarthworks = savedEW === '1'
        this.isAuthenticated = true
        return true
      }
      
      return false
    },

    // SHA-256 hash function (exact same as original app)
    async sha256(str) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
      return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    },

    // Update user preferences (same as original)
    updateTool(newTool) {
      this.currentTool = newTool
      LocalStorage.set('ek_tool', newTool)
    },

    updateEarthworks(hasEW) {
      this.userHasEarthworks = hasEW
      LocalStorage.set('ek_ew', hasEW ? '1' : '0')
    },

    // Get available tools list (same as original)
    getAvailableTools() {
      const baseTools = [
        { label: 'Magical Structures (MS)', value: 'MS' },
        { label: 'Multifrequency (MF)', value: 'MF' },
        { label: 'Omega (O)', value: 'O' },
        { label: 'Jewel (J)', value: 'J' },
        { label: 'Merlin\'s Grace (MG)', value: 'MG' },
        { label: 'Universal AP (AP)', value: 'AP' },
        { label: 'Manifesting Intention (MI)', value: 'MI' },
        { label: 'Magical Jewel (MJ)', value: 'MJ' },
        { label: 'Divine Magic (DM)', value: 'DM' }
      ]

      return baseTools
    },

    // Get Earthworks levels (if user has access)
    getEarthworksLevels() {
      if (!this.userHasEarthworks) return []
      
      return [
        { label: 'Earthworks 1 (EW1)', value: 'EW1' },
        { label: 'Earthworks 2 (EW2)', value: 'EW2' },
        { label: 'Earthworks 3 (EW3)', value: 'EW3' },
        { label: 'Earthworks 4 (EW4)', value: 'EW4' },
        { label: 'Earthworks 5 (EW5)', value: 'EW5' }
      ]
    }
  }
})
