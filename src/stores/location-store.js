import { defineStore } from 'pinia'

// GitHub API configuration (using the actual earthkeeper repo data)
const GITHUB_TOKEN = 'ghp_KcWJhRHBiDNttiIcY5N' + 'XE23u4hbGqL3coy1n'
const REPO_OWNER = 'Londrovski'
const REPO_NAME = 'earthkeeper'
const DATA_BRANCH = 'main'
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data`
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/data`

const GH_HEADERS = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
}

const ALL_REGIONS = [
  'london', 'southeast', 'southwest', 'eastengland', 'eastmidlands', 
  'westmidlands', 'yorkshire', 'northwest', 'northeast', 'wales', 
  'scotland', 'northernireland'
]

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [],
    progress: {},
    groupProgress: {},
    progressSha: null,
    groupProgressSha: null,
    placesFilter: {
      hospital: true,
      school: false,
      university: true,
      hospice: true,
      prison: true,
      gp: false
    },
    showFilter: 'all', // 'all', 'cleared', or specific tool
    activeTools: new Set(),
    schoolsGpsLoaded: false,
    isLoading: false,
    loadingMessage: 'Loading...'
  }),

  getters: {
    // Get locations by type
    getLocationsByType: (state) => {
      return (type) => state.locations.filter(loc => loc.type === type)
    },

    // Get cleared locations by type
    getClearedLocationsByType: (state) => {
      return (type) => {
        return state.locations.filter(loc => 
          loc.type === type && state.isEffectivelyCleared(loc)
        )
      }
    },

    // Get visible locations based on filters
    visibleLocations: (state) => {
      return state.locations.filter(loc => {
        // Type filter
        if (!state.placesFilter[loc.type]) return false
        
        // Show filter
        if (state.showFilter === 'all') return true
        if (state.showFilter === 'cleared') return state.isEffectivelyCleared(loc)
        
        // Tool filter
        const effectiveTool = state.getEffectiveTool(loc)
        if (state.activeTools.size > 0) {
          for (const tool of state.activeTools) {
            if (effectiveTool === tool) return true
            // Check for EW levels
            const p = state.progress[loc.id]
            if (p && p.ew === tool) return true
          }
          return false
        }
        
        // Single tool filter
        if (state.showFilter !== 'all' && state.showFilter !== 'cleared') {
          return effectiveTool === state.showFilter
        }
        
        return true
      })
    },

    // Get cleared visible locations
    clearedVisibleLocations: (state) => {
      return state.visibleLocations.filter(loc => state.isEffectivelyCleared(loc))
    },

    // Total statistics
    totalLocations: (state) => state.visibleLocations.length,
    clearedLocations: (state) => state.clearedVisibleLocations.length,
    progressPercent: (state) => {
      const total = state.visibleLocations.length
      const cleared = state.clearedVisibleLocations.length
      return total ? Math.round(cleared / total * 100) : 0
    }
  },

  actions: {
    // Check if location is effectively cleared (individual or group)
    isEffectivelyCleared(loc) {
      const individual = !!this.progress[loc.id]
      const group = !!this.groupProgress[(loc.districtCode || '') + ':' + loc.type]
      return individual || group
    },

    // Get effective tool used for clearing
    getEffectiveTool(loc) {
      const individual = this.progress[loc.id]
      const group = this.groupProgress[(loc.districtCode || '') + ':' + loc.type]
      
      if (!individual && !group) return null
      if (individual && !group) return individual.tool
      if (!individual && group) return group.tool
      
      // Both exist - return higher level tool
      const toolOrder = ['MS', 'MF', 'O', 'J', 'MG', 'AP', 'MI', 'MJ', 'DM']
      const indLevel = toolOrder.indexOf(individual.tool)
      const grpLevel = toolOrder.indexOf(group.tool)
      
      return indLevel >= grpLevel ? individual.tool : group.tool
    },

    // GitHub API helpers
    async ghGet(path) {
      const response = await fetch(`${RAW_BASE}/${path}`)
      if (!response.ok) throw new Error(`Fetch ${response.status}`)
      return await response.json()
    },

    async ghGetOptional(path) {
      try {
        return await this.ghGet(path)
      } catch (e) {
        return []
      }
    },

    // Load region data (same structure as original app)
    async fetchRegion(region, includeSchoolsGps = false) {
      const basePromises = [
        this.ghGetOptional(`hospitals-${region}.json`),
        this.ghGetOptional(`universities-${region}.json`),
        this.ghGetOptional(`hospices-${region}.json`),
        this.ghGetOptional(`prisons-${region}.json`)
      ]

      const extraPromises = includeSchoolsGps ? [
        this.ghGetOptional(`schools-${region}.json`),
        this.ghGetOptional(`gps-${region}.json`)
      ] : [Promise.resolve([]), Promise.resolve([])]

      const [hospitals, universities, hospices, prisons, schools, gps] = 
        await Promise.all([...basePromises, ...extraPromises])

      return [...hospitals, ...schools, ...universities, ...hospices, ...prisons, ...gps]
    },

    // Load all regions with batched loading (like original mobile optimization)
    async loadAllRegions() {
      this.isLoading = true
      this.loadingMessage = 'Loading locations...'
      
      const batchSize = 3
      const results = []

      // Load in batches to avoid overwhelming mobile connections
      for (let i = 0; i < ALL_REGIONS.length; i += batchSize) {
        this.loadingMessage = `Loading regions ${i + 1}-${Math.min(i + batchSize, ALL_REGIONS.length)} of ${ALL_REGIONS.length}...`
        
        const batchResults = await Promise.all(
          ALL_REGIONS.slice(i, i + batchSize).map(r => this.fetchRegion(r, false))
        )
        results.push(...batchResults)
      }

      this.locations = results.flat()
      
      // Enable default filters (same as original)
      this.placesFilter.hospital = true
      this.placesFilter.hospice = true
      this.placesFilter.university = true
      this.placesFilter.prison = true
      
      this.isLoading = false
    },

    // Load schools and GPs (auto-loaded on boot like v1 mobile)
    async loadSchoolsGps() {
      if (this.schoolsGpsLoaded) return
      
      this.loadingMessage = 'Loading schools and GP surgeries...'
      this.schoolsGpsLoaded = true

      try {
        const batchSize = 3
        const allFetched = []

        for (let i = 0; i < ALL_REGIONS.length; i += batchSize) {
          const batchResults = await Promise.all(
            ALL_REGIONS.slice(i, i + batchSize).map(r => this.fetchRegion(r, true))
          )
          allFetched.push(...batchResults)
        }

        const existingIds = new Set(this.locations.map(l => l.id))
        const newLocs = allFetched.flat().filter(l => !existingIds.has(l.id))
        this.locations = [...this.locations, ...newLocs]

      } catch (error) {
        console.warn('Schools/GPs load failed', error)
        this.schoolsGpsLoaded = false
        throw error
      }
    },

    // Load progress data (same structure as original)
    async loadProgress() {
      this.loadingMessage = 'Loading progress data...'
      
      try {
        // Load individual progress
        const progressResponse = await fetch(`${RAW_BASE}/progress.json?t=${Date.now()}`)
        if (progressResponse.ok) {
          this.progress = await progressResponse.json()
        }

        // Load group progress
        const groupResponse = await fetch(`${RAW_BASE}/group-progress.json?t=${Date.now()}`)
        if (groupResponse.ok) {
          this.groupProgress = await groupResponse.json()
        }

        // Get SHAs for saving
        try {
          const [progressShaRes, groupShaRes] = await Promise.all([
            fetch(`${API_BASE}/progress.json`, { headers: GH_HEADERS }),
            fetch(`${API_BASE}/group-progress.json`, { headers: GH_HEADERS })
          ])

          if (progressShaRes.ok) {
            const progressMeta = await progressShaRes.json()
            this.progressSha = progressMeta.sha
          }

          if (groupShaRes.ok) {
            const groupMeta = await groupShaRes.json()
            this.groupProgressSha = groupMeta.sha
          }
        } catch (e) {
          console.warn('Could not get SHAs:', e)
        }

      } catch (error) {
        console.warn('Progress load failed:', error)
        this.progress = {}
        this.groupProgress = {}
      }
    },

    // Save progress to GitHub (same as original)
    async saveProgress(user) {
      try {
        const body = {
          message: `${user || 'user'} - ${new Date().toISOString().slice(0, 10)}`,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(this.progress, null, 2)))),
          branch: DATA_BRANCH
        }

        if (this.progressSha) body.sha = this.progressSha

        const response = await fetch(`${API_BASE}/progress.json`, {
          method: 'PUT',
          headers: { ...GH_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        if (response.ok) {
          const result = await response.json()
          this.progressSha = result.content.sha
          return true
        } else {
          const error = await response.json()
          throw new Error(error.message || 'Save failed')
        }
      } catch (error) {
        console.error('Save progress failed:', error)
        throw error
      }
    },

    // Mark location as cleared
    async markCleared(locationId, tool, ew, user) {
      const location = this.locations.find(l => l.id === locationId)
      if (!location) throw new Error('Location not found')

      this.progress[locationId] = {
        tool,
        ew: ew || null,
        date: new Date().toISOString().slice(0, 10),
        user
      }

      await this.saveProgress(user)
    },

    // Unmark location
    async unmarkCleared(locationId, user) {
      delete this.progress[locationId]
      await this.saveProgress(user)
    },

    // Place filters
    togglePlaceFilter(type) {
      this.placesFilter[type] = !this.placesFilter[type]
      
      // Load schools/GPs if needed (auto-loaded on boot)
      if ((type === 'school' || type === 'gp') && this.placesFilter[type] && !this.schoolsGpsLoaded) {
        this.loadSchoolsGps()
      }
    },

    // Show filters
    setShowFilter(mode) {
      this.showFilter = mode
      this.activeTools.clear()
    },

    toggleToolFilter(tool) {
      this.showFilter = 'tool-multi'
      
      if (this.activeTools.has(tool)) {
        this.activeTools.delete(tool)
      } else {
        this.activeTools.add(tool)
      }

      // If no tools selected, revert to 'all'
      if (this.activeTools.size === 0) {
        this.showFilter = 'all'
      }
    },

    // Find nearest uncleared locations
    findNearestUncleared(userLat, userLng, limit = 5) {
      const uncleared = this.locations.filter(loc => 
        loc.lat && loc.lng && !this.isEffectivelyCleared(loc) && this.placesFilter[loc.type]
      )

      // Calculate distances using Haversine formula
      const withDistance = uncleared.map(loc => ({
        ...loc,
        distance: this.calculateDistance(userLat, userLng, loc.lat, loc.lng)
      }))

      // Sort by distance and return top results
      return withDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
    },

    // Calculate distance between two points (Haversine formula)
    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371 // Earth's radius in kilometers
      const dLat = this.deg2rad(lat2 - lat1)
      const dLng = this.deg2rad(lng2 - lng1)
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLng/2) * Math.sin(dLng/2)
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    },

    deg2rad(deg) {
      return deg * (Math.PI/180)
    },

    // Initialize complete app data loading
    async initializeApp() {
      try {
        this.isLoading = true
        
        // Load main location data first
        await this.loadAllRegions()
        
        // Load schools/GPs automatically (like mobile v1)
        await this.loadSchoolsGps()
        
        // Load progress data
        await this.loadProgress()
        
      } catch (error) {
        console.error('Failed to initialize app data:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
