<template>
  <div class="groups-tab">
    <div class="q-pa-md">
      <div class="text-caption text-soft q-mb-sm">GROUP TYPES</div>
      <div class="row q-gutter-sm">
        <q-chip 
          class="ek-location-chip school"
          :class="{ active: showSchools }"
          clickable
          @click="showSchools = !showSchools"
        >
          <div class="q-mr-xs rounded-full" style="width: 8px; height: 8px; background: #5B9BD5"></div>
          Schools
        </q-chip>
        <q-chip 
          class="ek-location-chip gp"
          :class="{ active: showGps }"
          clickable
          @click="showGps = !showGps"
        >
          <div class="q-mr-xs rounded-full" style="width: 8px; height: 8px; background: #4A9B6F"></div>
          GPs
        </q-chip>
      </div>
    </div>

    <!-- Search -->
    <div class="q-pa-md">
      <q-input
        v-model="searchQuery"
        placeholder="Search districts..."
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

    <!-- Stats bar (mobile) -->
    <div v-if="$q.screen.lt.md" class="q-pa-md">
      <div class="ek-stats text-center">
        <span class="text-gold text-weight-bold">{{ districtStats.total }}</span>
        <span class="text-soft q-mx-xs"> districts · </span>
        <span class="text-gold text-weight-bold">{{ districtStats.cleared }}</span>
        <span class="text-soft q-mx-xs"> cleared · </span>
        <span class="text-gold text-weight-bold">{{ districtStats.percent }}%</span>
        <span class="text-soft"> done</span>
      </div>
    </div>

    <!-- Districts list -->
    <div class="q-pa-md">
      <div v-if="filteredDistricts.length === 0" class="text-center text-soft q-py-xl">
        {{ searchQuery ? 'No districts found' : 'Districts loading...' }}
      </div>
      <div v-else>
        <div class="text-caption text-soft q-mb-md">
          {{ filteredDistricts.length }} districts
        </div>
        
        <q-list class="district-list">
          <q-item 
            v-for="district in filteredDistricts.slice(0, 20)" 
            :key="district.code"
            clickable
            @click="selectDistrict(district)"
            class="district-item"
          >
            <q-item-section avatar>
              <q-icon 
                name="location_city" 
                :color="getDistrictColor(district)"
                size="sm"
              />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-ink">{{ district.name }}</q-item-label>
              <q-item-label caption class="text-soft">
                {{ getDistrictSummary(district) }}
              </q-item-label>
            </q-item-section>
            
            <q-item-section side v-if="isDistrictCleared(district)">
              <q-icon name="check_circle" color="gold" size="sm"/>
            </q-item-section>
          </q-item>
          
          <q-item v-if="filteredDistricts.length > 20" class="text-center">
            <q-item-section>
              <div class="text-soft text-caption">
                Showing first 20 of {{ filteredDistricts.length }} districts
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useLocationStore } from '../stores/location-store'

export default defineComponent({
  name: 'GroupsTab',

  setup() {
    const locationStore = useLocationStore()
    const searchQuery = ref('')
    const showSchools = ref(true)
    const showGps = ref(true)

    // Mock district data for now - will be replaced with real district loading
    const mockDistricts = [
      { code: 'E06000001', name: 'Hartlepool', country: 'England' },
      { code: 'E06000002', name: 'Middlesbrough', country: 'England' },
      { code: 'E06000003', name: 'Redcar and Cleveland', country: 'England' },
      { code: 'E06000004', name: 'Stockton-on-Tees', country: 'England' },
      { code: 'E06000005', name: 'Darlington', country: 'England' },
      { code: 'W06000001', name: 'Isle of Anglesey', country: 'Wales' },
      { code: 'W06000002', name: 'Gwynedd', country: 'Wales' },
      { code: 'S12000033', name: 'Aberdeen City', country: 'Scotland' },
      { code: 'S12000034', name: 'Aberdeenshire', country: 'Scotland' },
      { code: 'N09000001', name: 'Antrim and Newtownabbey', country: 'Northern Ireland' }
    ]

    const filteredDistricts = computed(() => {
      let districts = mockDistricts

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        districts = districts.filter(district => 
          district.name.toLowerCase().includes(query) ||
          district.code.toLowerCase().includes(query)
        )
      }

      return districts
    })

    const districtStats = computed(() => {
      const total = mockDistricts.length
      const cleared = Math.floor(total * 0.15) // Mock 15% cleared
      return {
        total,
        cleared,
        percent: Math.round(cleared / total * 100)
      }
    })

    const getDistrictColor = (district) => {
      // Mock coloring based on country
      const colors = {
        'England': 'blue-6',
        'Wales': 'red-6', 
        'Scotland': 'purple-6',
        'Northern Ireland': 'orange-6'
      }
      return colors[district.country] || 'grey'
    }

    const getDistrictSummary = (district) => {
      // Mock summary - will show actual school/GP counts
      const schoolCount = Math.floor(Math.random() * 50) + 10
      const gpCount = Math.floor(Math.random() * 20) + 5
      
      const parts = []
      if (showSchools.value) parts.push(`${schoolCount} schools`)
      if (showGps.value) parts.push(`${gpCount} GPs`)
      
      return parts.join(' • ') || district.country
    }

    const isDistrictCleared = (district) => {
      // Mock - some districts randomly cleared
      return Math.random() > 0.8
    }

    const selectDistrict = (district) => {
      console.log('Selected district:', district)
      // TODO: Zoom to district and show detail popup
    }

    return {
      searchQuery,
      showSchools,
      showGps,
      filteredDistricts,
      districtStats,
      getDistrictColor,
      getDistrictSummary,
      isDistrictCleared,
      selectDistrict
    }
  }
})
</script>

<style lang="scss" scoped>
.text-soft {
  color: var(--soft);
}

.text-ink {
  color: var(--ink);
}

.text-gold {
  color: var(--gold);
}

.district-list {
  max-height: 60vh;
  overflow-y: auto;
}

.district-item {
  border-bottom: 1px solid rgba(232,213,160,.1);
  
  &:hover {
    background: rgba(201,168,76,.05);
  }
}
</style>