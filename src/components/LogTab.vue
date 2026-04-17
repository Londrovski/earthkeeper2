<template>
  <div class="log-tab">
    <!-- Date filters -->
    <div class="q-pa-md row q-gutter-sm items-center">
      <div class="text-caption text-soft">FROM</div>
      <q-input
        v-model="fromDate"
        type="date"
        filled
        dense
        dark
        style="max-width: 140px"
      />
      <div class="text-caption text-soft">TO</div>
      <q-input
        v-model="toDate"
        type="date"
        filled
        dense
        dark
        style="max-width: 140px"
      />
      <q-btn
        flat
        dense
        icon="clear"
        @click="clearDateFilter"
        size="sm"
      />
    </div>

    <!-- Search -->
    <div class="q-pa-md">
      <q-input
        v-model="searchQuery"
        placeholder="Search by name..."
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
        <span class="text-gold text-weight-bold">{{ logStats.individual }}</span>
        <span class="text-soft q-mx-xs"> individual · </span>
        <span class="text-gold text-weight-bold">{{ logStats.group }}</span>
        <span class="text-soft q-mx-xs"> group · </span>
        <span class="text-gold text-weight-bold">{{ logStats.total }}</span>
        <span class="text-soft"> total</span>
      </div>
    </div>

    <!-- Progress Panel (desktop) -->
    <div v-if="$q.screen.gt.sm" class="q-pa-md">
      <div class="ek-stats">
        <div class="text-caption text-soft text-uppercase q-mb-sm">Progress by Type</div>
        <div v-for="type in locationTypes" :key="type.key" class="row items-center q-mb-xs">
          <div class="text-body2 q-mr-sm" :style="`color: ${type.color}; width: 74px`">
            {{ type.label }}
          </div>
          <div class="col bg-grey-8 rounded-borders overflow-hidden" style="height: 4px;">
            <div 
              class="full-height transition-all" 
              :style="`background: ${type.color}; width: ${getProgressPercent(type.key)}%`"
            ></div>
          </div>
          <div class="text-caption text-soft q-ml-sm" style="min-width: 34px; text-align: right">
            {{ getProgressText(type.key) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Log entries -->
    <div class="q-pa-md">
      <div v-if="filteredEntries.length === 0" class="text-center text-soft q-py-xl">
        {{ hasFilters ? 'No entries match your filters' : 'No clearings recorded yet' }}
      </div>
      <div v-else>
        <div class="text-caption text-soft q-mb-md">
          {{ filteredEntries.length }} entries found
        </div>
        
        <q-list class="log-list">
          <q-item 
            v-for="entry in filteredEntries.slice(0, 30)" 
            :key="entry.id"
            class="log-entry"
          >
            <q-item-section avatar>
              <q-icon 
                :name="getEntryIcon(entry.type)" 
                :color="getEntryColor(entry.type)"
                size="sm"
              />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-ink">{{ entry.name }}</q-item-label>
              <q-item-label caption class="text-soft">
                {{ entry.type }} • {{ entry.tool }} {{ entry.ew ? `+ ${entry.ew}` : '' }}
              </q-item-label>
            </q-item-section>
            
            <q-item-section side>
              <div class="text-right">
                <div class="text-body2 text-gold">{{ entry.user }}</div>
                <div class="text-caption text-soft">{{ formatDate(entry.date) }}</div>
              </div>
            </q-item-section>
          </q-item>
          
          <q-item v-if="filteredEntries.length > 30" class="text-center">
            <q-item-section>
              <div class="text-soft text-caption">
                Showing first 30 of {{ filteredEntries.length }} entries
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
  name: 'LogTab',

  setup() {
    const locationStore = useLocationStore()
    const searchQuery = ref('')
    const fromDate = ref('')
    const toDate = ref('')

    const locationTypes = [
      { key: 'hospital', label: 'Hospital', color: '#E07050' },
      { key: 'hospice', label: 'Hospice', color: '#3DBFA8' },
      { key: 'prison', label: 'Prison', color: '#C4722A' },
      { key: 'university', label: 'University', color: '#9B78C8' },
      { key: 'school', label: 'School', color: '#5B9BD5' },
      { key: 'gp', label: 'GP Surgery', color: '#4A9B6F' }
    ]

    // Convert progress data to log entries
    const logEntries = computed(() => {
      const entries = []
      
      // Individual clearings
      Object.entries(locationStore.progress).forEach(([locationId, data]) => {
        const location = locationStore.locations.find(l => l.id === locationId)
        if (location) {
          entries.push({
            id: `ind_${locationId}`,
            name: location.name,
            type: location.type,
            tool: data.tool,
            ew: data.ew,
            user: data.user,
            date: data.date,
            isGroup: false
          })
        }
      })
      
      // Group clearings
      Object.entries(locationStore.groupProgress).forEach(([key, data]) => {
        const [districtCode, type] = key.split(':')
        entries.push({
          id: `grp_${key}`,
          name: `${districtCode} ${type}s`,
          type: type,
          tool: data.tool,
          ew: data.ew,
          user: data.user,
          date: data.date,
          isGroup: true
        })
      })
      
      // Sort by date (newest first)
      return entries.sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    const filteredEntries = computed(() => {
      let entries = logEntries.value

      // Date filter
      if (fromDate.value) {
        entries = entries.filter(entry => entry.date >= fromDate.value)
      }
      if (toDate.value) {
        entries = entries.filter(entry => entry.date <= toDate.value)
      }

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        entries = entries.filter(entry => 
          entry.name.toLowerCase().includes(query) ||
          entry.user.toLowerCase().includes(query) ||
          entry.tool.toLowerCase().includes(query)
        )
      }

      return entries
    })

    const logStats = computed(() => {
      const individual = Object.keys(locationStore.progress).length
      const group = Object.keys(locationStore.groupProgress).length
      return {
        individual,
        group,
        total: individual + group
      }
    })

    const hasFilters = computed(() => {
      return searchQuery.value || fromDate.value || toDate.value
    })

    const getProgressPercent = (type) => {
      const total = locationStore.getLocationsByType(type).length
      const cleared = locationStore.getClearedLocationsByType(type).length
      return total ? Math.round(cleared / total * 100) : 0
    }

    const getProgressText = (type) => {
      const total = locationStore.getLocationsByType(type).length
      const cleared = locationStore.getClearedLocationsByType(type).length
      return total ? `${cleared}/${total}` : '-'
    }

    const getEntryIcon = (type) => {
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

    const getEntryColor = (type) => {
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

    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }

    const clearDateFilter = () => {
      fromDate.value = ''
      toDate.value = ''
    }

    return {
      searchQuery,
      fromDate,
      toDate,
      locationTypes,
      logEntries,
      filteredEntries,
      logStats,
      hasFilters,
      getProgressPercent,
      getProgressText,
      getEntryIcon,
      getEntryColor,
      formatDate,
      clearDateFilter
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

.log-list {
  max-height: 60vh;
  overflow-y: auto;
}

.log-entry {
  border-bottom: 1px solid rgba(232,213,160,.1);
  
  &:hover {
    background: rgba(201,168,76,.05);
  }
}
</style>