<template>
  <div class="locations-tab">
    <!-- Place filters -->
    <div class="q-pa-md">
      <div class="text-caption text-soft q-mb-sm">PLACES</div>
      <div class="row q-gutter-sm">
        <q-chip 
          v-for="type in placeTypes" 
          :key="type.key"
          :class="['ek-location-chip', type.key, { active: locationStore.placesFilter[type.key] }]"
          clickable
          @click="locationStore.togglePlaceFilter(type.key)"
        >
          <div class="q-mr-xs rounded-full" :style="`width: 8px; height: 8px; background: ${type.color}`"></div>
          {{ type.label }}
        </q-chip>
      </div>
    </div>

    <!-- Show filters -->
    <div class="q-pa-md">
      <div class="text-caption text-soft q-mb-sm">SHOW</div>
      <div class="row q-gutter-sm">
        <q-chip 
          :class="{ 'bg-gold text-forest': locationStore.showFilter === 'all' }"
          clickable
          @click="locationStore.setShowFilter('all')"
        >
          All
        </q-chip>
        <q-chip 
          :class="{ 'bg-gold text-forest': locationStore.showFilter === 'cleared' }"
          clickable
          @click="locationStore.setShowFilter('cleared')"
        >
          <div class="q-mr-xs rounded-full" style="width: 8px; height: 8px; background: var(--gold)"></div>
          All Cleared
        </q-chip>
      </div>
      
      <!-- By Tool dropdown (inline for mobile) -->
      <div class="row items-center q-mt-sm" v-if="$q.screen.gt.sm">
        <div class="text-caption text-soft q-mr-md">BY TOOL</div>
        <div class="row q-gutter-xs">
          <q-chip 
            v-for="tool in toolOptions" 
            :key="tool.value"
            :class="{ 'bg-gold text-forest': locationStore.activeTools.has(tool.value) }"
            clickable
            @click="locationStore.toggleToolFilter(tool.value)"
            size="sm"
          >
            {{ tool.value }}
          </q-chip>
        </div>
      </div>
      
      <!-- Mobile inline By Tool dropdown -->
      <div v-else class="q-mt-sm">
        <q-select
          v-model="selectedTool"
          :options="toolOptions"
          label="By Tool"
          emit-value
          map-options
          filled
          dense
          dark
          clearable
          @update:model-value="onToolChange"
        />
      </div>
    </div>

    <!-- Stats bar (mobile) -->
    <div v-if="$q.screen.lt.md" class="q-pa-md">
      <div class="ek-stats text-center">
        <span class="text-gold text-weight-bold">{{ locationStore.totalLocations.toLocaleString() }}</span>
        <span class="text-soft q-mx-xs"> locations · </span>
        <span class="text-gold text-weight-bold">{{ locationStore.clearedLocations }}</span>
        <span class="text-soft q-mx-xs"> cleared · </span>
        <span class="text-gold text-weight-bold">{{ locationStore.progressPercent }}%</span>
        <span class="text-soft"> done</span>
      </div>
    </div>

    <!-- Search -->
    <div class="q-pa-md">
      <q-input
        v-model="searchQuery"
        placeholder="Search by name or address..."
        filled
        dense
        dark
        debounce="300"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Results -->
    <div class="q-pa-md" v-if="searchQuery || locationStore.visibleLocations.length > 0">
      <div v-if="filteredLocations.length === 0" class="text-center text-soft q-py-xl">
        {{ searchQuery ? 'No matches found' : 'No locations to show' }}
      </div>
      <div v-else>
        <div class="text-caption text-soft q-mb-md">
          {{ filteredLocations.length.toLocaleString() }} locations found
        </div>
        
        <!-- Location list -->
        <q-list class="location-list">
          <q-item 
            v-for="location in filteredLocations.slice(0, 50)" 
            :key="location.id"
            clickable
            @click="selectLocation(location)"
            class="location-item"
          >
            <q-item-section avatar>
              <q-icon 
                :name="getLocationIcon(location.type)" 
                :color="getLocationColor(location.type)"
                size="sm"
              />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-ink">{{ location.name }}</q-item-label>
              <q-item-label caption class="text-soft">
                {{ location.address || location.postcode || location.type }}
              </q-item-label>
            </q-item-section>
            
            <q-item-section side v-if="locationStore.isEffectivelyCleared(location)">
              <q-icon name="check_circle" color="gold" size="sm"/>
            </q-item-section>
          </q-item>
          
          <q-item v-if="filteredLocations.length > 50" class="text-center">
            <q-item-section>
              <div class="text-soft text-caption">
                Showing first 50 of {{ filteredLocations.length.toLocaleString() }} results
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-else-if="locationStore.isLoading" class="text-center text-soft q-py-xl">
      <q-spinner-dots size="40px" color="gold" />
      <div class="q-mt-md">{{ locationStore.loadingMessage }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useLocationStore } from '../stores/location-store'

export default defineComponent({
  name: 'LocationsTab',

  setup() {
    const locationStore = useLocationStore()
    const searchQuery = ref('')
    const selectedTool = ref(null)

    const placeTypes = [
      { key: 'hospital', label: 'Hospitals', color: '#E07050' },
      { key: 'hospice', label: 'Hospices', color: '#3DBFA8' },
      { key: 'university', label: 'Unis', color: '#9B78C8' },
      { key: 'prison', label: 'Prisons', color: '#C4722A' },
      { key: 'school', label: 'Schools', color: '#5B9BD5' },
      { key: 'gp', label: 'GPs', color: '#4A9B6F' }
    ]

    const toolOptions = [
      { label: 'Magical Structures', value: 'MS' },
      { label: 'Multifrequency', value: 'MF' },
      { label: 'Omega', value: 'O' },
      { label: 'Jewel', value: 'J' },
      { label: 'Merlin\'s Grace', value: 'MG' },
      { label: 'Universal AP', value: 'AP' },
      { label: 'Manifesting Intention', value: 'MI' },
      { label: 'Magical Jewel', value: 'MJ' },
      { label: 'Divine Magic', value: 'DM' }
    ]

    const filteredLocations = computed(() => {
      let locations = locationStore.visibleLocations

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        locations = locations.filter(loc => 
          loc.name.toLowerCase().includes(query) ||
          (loc.address || '').toLowerCase().includes(query) ||
          (loc.postcode || '').toLowerCase().includes(query)
        )
      }

      return locations
    })

    const getLocationIcon = (type) => {
      const icons = {
        hospital: 'local_hospital',
        hospice: 'favorite',
        prison: 'security',
        university: 'school',
        school: 'menu_book',
        gp: 'medical_services'
      }
      return icons[type] || 'place'
    }

    const getLocationColor = (type) => {
      const colors = {
        hospital: 'red-5',
        hospice: 'teal-5',
        prison: 'orange-7',
        university: 'deep-purple-5',
        school: 'blue-5',
        gp: 'green-6'
      }
      return colors[type] || 'grey'
    }

    const selectLocation = (location) => {
      // TODO: Center map on location and show popup
      console.log('Selected location:', location)
    }

    const onToolChange = (tool) => {
      if (tool) {
        locationStore.setShowFilter(tool)
      } else {
        locationStore.setShowFilter('all')
      }
    }

    return {
      locationStore,
      searchQuery,
      selectedTool,
      placeTypes,
      toolOptions,
      filteredLocations,
      getLocationIcon,
      getLocationColor,
      selectLocation,
      onToolChange
    }
  }
})
</script>

<style lang="scss" scoped>
.bg-gold {
  background: var(--gold) !important;
}

.text-forest {
  color: var(--forest) !important;
}

.text-soft {
  color: var(--soft);
}

.text-ink {
  color: var(--ink);
}

.location-list {
  max-height: 60vh;
  overflow-y: auto;
}

.location-item {
  border-bottom: 1px solid rgba(232,213,160,.1);
  
  &:hover {
    background: rgba(201,168,76,.05);
  }
}
</style>
