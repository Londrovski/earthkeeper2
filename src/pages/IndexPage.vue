<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title style="font-size: 20px; font-weight: 600;">
          Earth<em style="font-style: italic;">keeper</em> 2.0
        </q-toolbar-title>
        
        <q-space />
        
        <!-- User Menu -->
        <q-btn flat v-if="isLoggedIn" @click="showUserMenu = !showUserMenu">
          {{ currentUser }}
          <q-icon name="arrow_drop_down" />
        </q-btn>
        <q-btn flat v-else @click="goToLogin">
          Login
        </q-btn>
        
        <!-- User Dropdown -->
        <q-menu v-model="showUserMenu" v-if="isLoggedIn">
          <q-list>
            <q-item>
              <q-item-section>
                <div><strong>{{ currentUser }}</strong></div>
                <div class="text-caption">{{ currentTool }}{{ hasEarthworks ? ' + EW' : '' }}</div>
                <div class="text-caption text-grey">Since {{ loginDateFormatted }}</div>
              </q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="logout">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <q-page class="flex flex-center">
        <!-- Not Logged In -->
        <div v-if="!isLoggedIn" class="text-center">
          <div style="max-width: 400px;">
            <h2 style="color: #C9A84C; margin-bottom: 20px;">Welcome to Earthkeeper 2.0</h2>
            <p style="color: #666; margin-bottom: 30px;">Track energy clearings across UK hospitals, hospices, prisons, universities, schools, and GP surgeries.</p>
            <q-btn color="primary" size="lg" label="Login to Continue" @click="goToLogin" />
          </div>
        </div>
        
        <!-- Logged In - Loading State -->
        <div v-else-if="dataLoading" class="text-center">
          <q-spinner-dots size="60px" color="orange" class="q-mb-lg" />
          <h3 style="color: #C9A84C;">{{ loadingMessage }}</h3>
          <p style="color: #666;">{{ loadingDetails }}</p>
          <q-linear-progress 
            :value="loadingProgress" 
            color="orange" 
            size="8px" 
            class="q-mt-md" 
            style="width: 300px;"
          />
        </div>
        
        <!-- Logged In - Main Interface -->
        <div v-else class="full-width">
          <!-- Stats Bar -->
          <div class="q-pa-md bg-grey-9 text-center">
            <div class="row q-gutter-lg justify-center">
              <div>
                <div class="text-h4 text-orange">{{ totalLocations.toLocaleString() }}</div>
                <div class="text-caption text-grey-5">Total Locations</div>
              </div>
              <div>
                <div class="text-h4 text-green">{{ clearedCount.toLocaleString() }}</div>
                <div class="text-caption text-grey-5">Cleared</div>
              </div>
              <div>
                <div class="text-h4 text-blue">{{ progressPercent }}%</div>
                <div class="text-caption text-grey-5">Complete</div>
              </div>
            </div>
          </div>
          
          <!-- Tabs -->
          <q-tabs v-model="activeTab" class="bg-grey-8 text-white">
            <q-tab name="locations" label="Locations" />
            <q-tab name="groups" label="Groups" />
            <q-tab name="log" label="Log" />
          </q-tabs>
          
          <!-- Tab Panels -->
          <q-tab-panels v-model="activeTab" class="bg-white" style="min-height: 60vh;">
            <!-- Locations Tab -->
            <q-tab-panel name="locations">
              <div class="q-pa-md">
                <!-- Search -->
                <q-input 
                  v-model="locationSearch" 
                  placeholder="Search locations..." 
                  filled 
                  class="q-mb-md"
                  debounce="300"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
                
                <!-- Location Filters -->
                <div class="q-mb-md">
                  <q-chip 
                    v-for="type in locationTypes" 
                    :key="type.key"
                    :color="type.color"
                    text-color="white"
                    :outline="!activeFilters.includes(type.key)"
                    clickable
                    @click="toggleFilter(type.key)"
                    class="q-mr-sm"
                  >
                    {{ type.label }}
                  </q-chip>
                </div>
                
                <!-- Locations List -->
                <q-list separator>
                  <q-item v-for="location in filteredLocations.slice(0, 50)" :key="location.id" clickable>
                    <q-item-section avatar>
                      <q-icon :name="getLocationIcon(location.type)" :color="getLocationColor(location.type)" />
                    </q-item-section>
                    
                    <q-item-section>
                      <q-item-label>{{ location.name }}</q-item-label>
                      <q-item-label caption>{{ location.type }} • {{ location.district || 'Unknown District' }}</q-item-label>
                    </q-item-section>
                    
                    <q-item-section side v-if="isLocationCleared(location.id)">
                      <q-icon name="check_circle" color="green" />
                    </q-item-section>
                  </q-item>
                  
                  <q-item v-if="filteredLocations.length > 50">
                    <q-item-section class="text-center text-grey">
                      Showing 50 of {{ filteredLocations.length.toLocaleString() }} locations
                    </q-item-section>
                  </q-item>
                  
                  <q-item v-if="filteredLocations.length === 0">
                    <q-item-section class="text-center text-grey">
                      {{ locationSearch ? 'No locations found matching your search' : 'Loading locations...' }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-tab-panel>
            
            <!-- Groups Tab -->
            <q-tab-panel name="groups">
              <div class="q-pa-md">
                <h6>Districts & Group Progress</h6>
                <p class="text-grey">District-level clearing management coming soon...</p>
                
                <!-- Group Progress Stats -->
                <div class="q-mt-md">
                  <div v-for="type in locationTypes" :key="type.key" class="q-mb-sm">
                    <div class="row items-center">
                      <div class="col-2 text-weight-bold" :style="`color: ${type.color}`">
                        {{ type.label }}
                      </div>
                      <div class="col">
                        <q-linear-progress 
                          :value="getTypeProgress(type.key)" 
                          :color="type.color.split('-')[0]" 
                          size="12px" 
                        />
                      </div>
                      <div class="col-2 text-right text-caption">
                        {{ getTypeStats(type.key) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-tab-panel>
            
            <!-- Log Tab -->
            <q-tab-panel name="log">
              <div class="q-pa-md">
                <h6>Activity Log</h6>
                
                <q-list separator v-if="logEntries.length > 0">
                  <q-item v-for="entry in logEntries.slice(0, 20)" :key="entry.id">
                    <q-item-section avatar>
                      <q-icon :name="getLocationIcon(entry.type)" :color="getLocationColor(entry.type)" />
                    </q-item-section>
                    
                    <q-item-section>
                      <q-item-label>{{ entry.locationName || entry.id }}</q-item-label>
                      <q-item-label caption>{{ entry.tool }}{{ entry.ew ? ` + ${entry.ew}` : '' }} • {{ entry.user }}</q-item-label>
                    </q-item-section>
                    
                    <q-item-section side>
                      <q-item-label caption>{{ formatDate(entry.date) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                
                <div v-else class="text-center text-grey q-pa-xl">
                  No clearings recorded yet
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  
  data() {
    return {
      // Auth state
      isLoggedIn: false,
      currentUser: '',
      currentTool: '',
      hasEarthworks: false,
      loginDate: null,
      showUserMenu: false,
      
      // Data state
      dataLoading: false,
      loadingMessage: '',
      loadingDetails: '',
      loadingProgress: 0,
      
      // App data
      locations: [],
      progress: {},
      groupProgress: {},
      
      // UI state
      activeTab: 'locations',
      locationSearch: '',
      activeFilters: ['hospital', 'hospice', 'prison', 'university', 'school', 'gp'],
      
      // Constants
      locationTypes: [
        { key: 'hospital', label: 'Hospital', color: 'red-5' },
        { key: 'hospice', label: 'Hospice', color: 'teal-5' },
        { key: 'prison', label: 'Prison', color: 'orange-7' },
        { key: 'university', label: 'University', color: 'deep-purple-5' },
        { key: 'school', label: 'School', color: 'blue-5' },
        { key: 'gp', label: 'GP Surgery', color: 'green-6' }
      ]
    }
  },
  
  computed: {
    loginDateFormatted() {
      if (!this.loginDate) return ''
      return new Date(this.loginDate).toLocaleDateString()
    },
    
    totalLocations() {
      return this.locations.length
    },
    
    clearedCount() {
      return Object.keys(this.progress).length
    },
    
    progressPercent() {
      return this.totalLocations ? Math.round(this.clearedCount / this.totalLocations * 100) : 0
    },
    
    filteredLocations() {
      let filtered = this.locations
      
      // Filter by type
      if (this.activeFilters.length > 0) {
        filtered = filtered.filter(loc => this.activeFilters.includes(loc.type))
      }
      
      // Filter by search
      if (this.locationSearch) {
        const query = this.locationSearch.toLowerCase()
        filtered = filtered.filter(loc => 
          loc.name.toLowerCase().includes(query) ||
          (loc.district && loc.district.toLowerCase().includes(query))
        )
      }
      
      return filtered
    },
    
    logEntries() {
      const entries = []
      
      // Individual clearings
      Object.entries(this.progress).forEach(([locationId, data]) => {
        const location = this.locations.find(l => l.id === locationId)
        entries.push({
          id: locationId,
          locationName: location ? location.name : 'Unknown Location',
          type: location ? location.type : 'unknown',
          ...data
        })
      })
      
      // Sort by date (newest first)
      return entries.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  },
  
  mounted() {
    this.checkLoginState()
    if (this.isLoggedIn) {
      this.loadAppData()
    }
  },
  
  methods: {
    checkLoginState() {
      this.isLoggedIn = localStorage.getItem('ek2_logged_in') === 'true'
      this.currentUser = localStorage.getItem('ek2_user') || ''
      this.currentTool = localStorage.getItem('ek2_tool') || 'MG'
      this.hasEarthworks = localStorage.getItem('ek2_has_earthworks') === 'true'
      this.loginDate = localStorage.getItem('ek2_login_date')
    },
    
    async loadAppData() {
      this.dataLoading = true
      this.loadingProgress = 0
      
      try {
        // Load progress data
        this.loadingMessage = 'Loading progress data...'
        this.loadingDetails = 'Fetching clearing records'
        await this.loadProgressData()
        this.loadingProgress = 0.2
        
        // Load location data (hospitals, hospices, etc.)
        this.loadingMessage = 'Loading location database...'
        this.loadingDetails = 'Loading hospitals and hospices'
        await this.loadHospitals()
        this.loadingProgress = 0.4
        
        this.loadingDetails = 'Loading prisons'
        await this.loadPrisons()
        this.loadingProgress = 0.6
        
        this.loadingDetails = 'Loading universities'
        await this.loadUniversities()
        this.loadingProgress = 0.7
        
        this.loadingDetails = 'Loading schools'
        await this.loadSchools()
        this.loadingProgress = 0.9
        
        this.loadingDetails = 'Loading GP surgeries'
        await this.loadGPs()
        this.loadingProgress = 1.0
        
        this.loadingMessage = 'Data loaded successfully!'
        
        // Small delay to show completion
        setTimeout(() => {
          this.dataLoading = false
        }, 500)
        
      } catch (error) {
        console.error('Failed to load data:', error)
        this.loadingMessage = 'Error loading data'
        this.loadingDetails = error.message
        
        // Still show the interface even if data fails
        setTimeout(() => {
          this.dataLoading = false
        }, 2000)
      }
    },
    
    async loadProgressData() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Londrovski/earthkeeper/main/data/progress.json')
        if (response.ok) {
          this.progress = await response.json()
        }
        
        const groupResponse = await fetch('https://raw.githubusercontent.com/Londrovski/earthkeeper/main/data/groupProgress.json')
        if (groupResponse.ok) {
          this.groupProgress = await groupResponse.json()
        }
      } catch (error) {
        console.warn('Could not load progress data:', error)
      }
    },
    
    async loadHospitals() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Londrovski/earthkeeper/main/data/hospitals.json')
        if (response.ok) {
          const hospitals = await response.json()
          hospitals.forEach(h => {
            this.locations.push({ ...h, type: 'hospital' })
          })
        }
        
        const hospiceResponse = await fetch('https://raw.githubusercontent.com/Londrovski/earthkeeper/main/data/hospices.json')
        if (hospiceResponse.ok) {
          const hospices = await hospiceResponse.json()
          hospices.forEach(h => {
            this.locations.push({ ...h, type: 'hospice' })
          })
        }
      } catch (error) {
        console.warn('Could not load hospitals/hospices:', error)
      }
    },
    
    async loadPrisons() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Londrovski/earthkeeper/main/data/prisons.json')
        if (response.ok) {
          const prisons = await response.json()
          prisons.forEach(p => {
            this.locations.push({ ...p, type: 'prison' })
          })
        }
      } catch (error) {
        console.warn('Could not load prisons:', error)
      }
    },
    
    async loadUniversities() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Londrovski/earthkeeper/main/data/universities.json')
        if (response.ok) {
          const universities = await response.json()
          universities.forEach(u => {
            this.locations.push({ ...u, type: 'university' })
          })
        }
      } catch (error) {
        console.warn('Could not load universities:', error)
      }
    },
    
    async loadSchools() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Londrovski/earthkeeper/main/data/schools.json')
        if (response.ok) {
          const schools = await response.json()
          schools.forEach(s => {
            this.locations.push({ ...s, type: 'school' })
          })
        }
      } catch (error) {
        console.warn('Could not load schools:', error)
      }
    },
    
    async loadGPs() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Londrovski/earthkeeper/main/data/gps.json')
        if (response.ok) {
          const gps = await response.json()
          gps.forEach(g => {
            this.locations.push({ ...g, type: 'gp' })
          })
        }
      } catch (error) {
        console.warn('Could not load GPs:', error)
      }
    },
    
    toggleFilter(typeKey) {
      const index = this.activeFilters.indexOf(typeKey)
      if (index > -1) {
        this.activeFilters.splice(index, 1)
      } else {
        this.activeFilters.push(typeKey)
      }
    },
    
    isLocationCleared(locationId) {
      return !!this.progress[locationId]
    },
    
    getLocationIcon(type) {
      const icons = {
        hospital: 'local_hospital',
        hospice: 'favorite',
        prison: 'security',
        university: 'school',
        school: 'menu_book',
        gp: 'medical_services'
      }
      return icons[type] || 'place'
    },
    
    getLocationColor(type) {
      const typeObj = this.locationTypes.find(t => t.key === type)
      return typeObj ? typeObj.color : 'grey'
    },
    
    getTypeProgress(type) {
      const typeLocations = this.locations.filter(l => l.type === type)
      const clearedCount = typeLocations.filter(l => this.isLocationCleared(l.id)).length
      return typeLocations.length ? clearedCount / typeLocations.length : 0
    },
    
    getTypeStats(type) {
      const typeLocations = this.locations.filter(l => l.type === type)
      const clearedCount = typeLocations.filter(l => this.isLocationCleared(l.id)).length
      return `${clearedCount}/${typeLocations.length}`
    },
    
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-GB')
    },
    
    goToLogin() {
      window.location.href = '/login'
    },
    
    logout() {
      localStorage.removeItem('ek2_logged_in')
      localStorage.removeItem('ek2_user')
      localStorage.removeItem('ek2_tool')
      localStorage.removeItem('ek2_has_earthworks')
      localStorage.removeItem('ek2_login_date')
      
      this.isLoggedIn = false
      this.currentUser = ''
      this.showUserMenu = false
      
      // Clear data
      this.locations = []
      this.progress = {}
      this.groupProgress = {}
    }
  }
})
</script>