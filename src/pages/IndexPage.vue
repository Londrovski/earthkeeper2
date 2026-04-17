<template>
  <q-page class="flex column no-wrap">
    <!-- Mobile Stats Bar -->
    <div v-if="$q.screen.lt.md && authStore.isAuthenticated" 
         class="bg-forest-m q-pa-sm text-center mobile-visible">
      <span class="text-gold text-weight-bold">{{ locationStore.totalLocations.toLocaleString() }}</span>
      <span class="text-soft q-mx-xs"> locations · </span>
      <span class="text-gold text-weight-bold">{{ locationStore.clearedLocations }}</span>
      <span class="text-soft q-mx-xs"> cleared · </span>
      <span class="text-gold text-weight-bold">{{ locationStore.progressPercent }}%</span>
      <span class="text-soft"> done</span>
    </div>

    <!-- Map Container -->
    <div class="col ek-map-container">
      <div id="earthkeeper-map" style="width: 100%; height: 100%;">
        <!-- Loading State -->
        <div v-if="locationStore.isLoading" class="absolute-full bg-forest flex flex-center">
          <div class="text-center">
            <q-spinner-dots size="50px" color="gold" class="q-mb-md"/>
            <div class="text-gold q-mb-xs">{{ locationStore.loadingMessage }}</div>
            <div class="text-soft text-caption">
              Loading {{ locationStore.locations.length.toLocaleString() }} locations...
            </div>
          </div>
        </div>

        <!-- Map Placeholder (until MapLibre integrated) -->
        <div v-else-if="!mapStore.mapReady" class="absolute-full bg-forest flex flex-center">
          <div class="text-center">
            <q-avatar size="120px" class="q-mb-md">
              <img src="/earthkeeper-circular.png" alt="Earthkeeper">
            </q-avatar>
            <div class="ek-logo text-h4 q-mb-md">
              Earth<em>keeper</em> 2.0
            </div>
            <div class="text-soft q-mb-md">
              Map integration coming soon...
            </div>
            <div class="text-gold text-body2">
              {{ locationStore.locations.length.toLocaleString() }} locations loaded
            </div>
          </div>
        </div>
      </div>
      
      <!-- Map Overlays -->
      <div class="absolute-top-right q-ma-md" v-if="authStore.isAuthenticated">
        <!-- Legend -->
        <div class="ek-stats">
          <div class="text-caption text-soft text-uppercase q-mb-sm">Legend</div>
          <div v-for="type in locationTypes" :key="type.key" class="row items-center q-mb-xs">
            <div 
              class="q-mr-sm rounded-borders" 
              style="width: 12px; height: 12px"
              :style="`background: ${type.color}`"
            ></div>
            <div class="text-body2">{{ type.label }}</div>
          </div>
          <div class="row items-center">
            <div 
              class="q-mr-sm rounded-borders" 
              style="width: 12px; height: 12px; background: var(--gold); border: 2px solid rgba(255,255,255,0.5)"
            ></div>
            <div class="text-body2">Cleared</div>
          </div>
        </div>
      </div>

      <!-- Home Button -->
      <q-btn 
        fab
        icon="home"
        color="forest-m"
        text-color="gold"
        class="absolute"
        style="top: 90px; left: 14px; z-index: 100"
        @click="goHome"
        size="sm"
        v-if="authStore.isAuthenticated"
      />

      <!-- Locate Me Button -->
      <q-btn 
        flat
        icon="my_location"
        label="Find Me"
        color="forest-m"
        text-color="gold-l"
        class="absolute"
        style="bottom: 22px; left: 14px; z-index: 100"
        @click="locateUser"
        dense
        v-if="authStore.isAuthenticated"
      />
    </div>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="locationStore.isLoading">
      <q-spinner-dots size="50px" color="gold" />
      <div class="text-gold q-mt-md">{{ locationStore.loadingMessage }}</div>
    </q-inner-loading>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'
import { useLocationStore } from '../stores/location-store'
import { useMapStore } from '../stores/map-store'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const authStore = useAuthStore()
    const locationStore = useLocationStore()
    const mapStore = useMapStore()

    // Location types with same colors as original
    const locationTypes = [
      { key: 'hospital', label: 'Hospital', color: '#E07050' },
      { key: 'hospice', label: 'Hospice', color: '#3DBFA8' },
      { key: 'prison', label: 'Prison', color: '#C4722A' },
      { key: 'university', label: 'University', color: '#9B78C8' },
      { key: 'school', label: 'School', color: '#5B9BD5' },
      { key: 'gp', label: 'GP Surgery', color: '#4A9B6F' }
    ]

    const goHome = () => {
      if (mapStore.map) {
        mapStore.flyToUK()
      }
    }

    const locateUser = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: lat, longitude: lng } = position.coords
            if (mapStore.map) {
              mapStore.flyTo([lng, lat], 11)
            }
            
            // Find nearest uncleared locations
            const nearest = locationStore.findNearestUncleared(lat, lng, 5)
            if (nearest.length > 0) {
              const nearestLoc = nearest[0]
              $q.notify({
                message: `Nearest uncleared: ${nearestLoc.name}`,
                caption: `${nearestLoc.distance.toFixed(1)}km away`,
                color: 'positive',
                icon: 'place'
              })
            }
          },
          (error) => {
            $q.notify({
              message: 'Could not get your location',
              color: 'negative'
            })
          }
        )
      }
    }

    // Check authentication and redirect if needed
    const checkAuth = () => {
      // Check for existing session first
      authStore.checkExistingSession()
      
      if (!authStore.isAuthenticated) {
        router.push('/login')
      }
    }

    onMounted(async () => {
      try {
        // Check authentication first
        checkAuth()
        
        if (authStore.isAuthenticated) {
          // Initialize app data
          await locationStore.initializeApp()
          
          $q.notify({
            message: `Welcome back, ${authStore.currentUser}!`,
            caption: `${locationStore.locations.length.toLocaleString()} locations loaded`,
            color: 'positive',
            icon: 'check_circle',
            timeout: 3000
          })
        }
      } catch (error) {
        console.error('Failed to initialize app:', error)
        $q.notify({
          message: 'Failed to load data',
          caption: error.message,
          color: 'negative',
          icon: 'error'
        })
      }
    })

    // Watch for authentication changes
    watch(() => authStore.isAuthenticated, (isAuth) => {
      if (!isAuth) {
        router.push('/login')
      }
    })

    return {
      authStore,
      locationStore,
      mapStore,
      locationTypes,
      goHome,
      locateUser
    }
  }
})
</script>

<style lang="scss" scoped>
.bg-forest-m {
  background: var(--forest-m);
}

.text-soft {
  color: var(--soft);
}

.text-gold {
  color: var(--gold);
}

.bg-forest {
  background: var(--forest);
}

.absolute-full {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
