<template>
  <q-page class="flex column no-wrap">
    <!-- Mobile Stats Bar -->
    <div v-if="$q.screen.lt.md" 
         class="bg-forest-m q-pa-sm text-center">
      <span class="text-gold text-weight-bold">1,234</span>
      <span class="text-soft q-mx-xs"> locations · </span>
      <span class="text-gold text-weight-bold">456</span>
      <span class="text-soft q-mx-xs"> cleared · </span>
      <span class="text-gold text-weight-bold">37%</span>
      <span class="text-soft"> done</span>
    </div>

    <!-- Map Container -->
    <div class="col ek-map-container">
      <div id="earthkeeper-map" style="width: 100%; height: 100%; background: var(--forest); display: flex; align-items: center; justify-content: center;">
        <div class="text-center">
          <q-avatar size="120px" class="q-mb-md">
            <img src="/earthkeeper-circular.png" alt="Earthkeeper">
          </q-avatar>
          <div class="ek-logo text-h4 q-mb-md">
            Earth<em>keeper</em> 2.0
          </div>
          <div class="text-soft">
            Map loading... (MapLibre integration coming soon)
          </div>
        </div>
      </div>
      
      <!-- Map Overlays -->
      <div class="absolute-top-right q-ma-md">
        <!-- Legend -->
        <div class="ek-stats">
          <div class="text-caption text-soft text-uppercase q-mb-sm">Legend</div>
          <div class="row items-center q-mb-xs" v-for="type in locationTypes" :key="type.key">
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
        size="sm"
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
        dense
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',

  setup() {
    const locationTypes = [
      { key: 'hospital', label: 'Hospital', color: '#E07050' },
      { key: 'hospice', label: 'Hospice', color: '#3DBFA8' },
      { key: 'prison', label: 'Prison', color: '#C4722A' },
      { key: 'university', label: 'University', color: '#9B78C8' },
      { key: 'school', label: 'School', color: '#5B9BD5' },
      { key: 'gp', label: 'GP Surgery', color: '#4A9B6F' }
    ]

    return {
      locationTypes
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
</style>