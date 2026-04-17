import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    map: null,
    mapReady: false,
    selectedLocationId: null,
    locationMarker: null
  }),

  getters: {
    isMapReady: (state) => state.mapReady
  },

  actions: {
    // Initialize map placeholder (MapLibre integration coming soon)
    async initializeMap(containerId) {
      try {
        console.log('Map initialization placeholder for container:', containerId)
        // TODO: Initialize MapLibre map with dark CARTO tiles
        
        // For now, just mark as ready
        this.mapReady = false // Keep false until MapLibre is integrated
        
        return Promise.resolve()
      } catch (error) {
        console.error('Failed to initialize map:', error)
        throw error
      }
    },

    // Navigation methods (placeholder)
    flyTo(center, zoom = 10) {
      if (!this.map) return
      console.log('Map flyTo:', center, zoom)
    },

    flyToUK() {
      this.flyTo([-1.5, 53.5], 5.5)
    },

    fitBounds(locations, options = {}) {
      if (!this.map || !locations.length) return
      console.log('Map fitBounds:', locations.length, 'locations')
    },

    // Click handlers (placeholder)
    addClickHandlers(onLocationClick) {
      console.log('Map click handlers placeholder')
    },

    // User location (placeholder)
    showUserLocation(lat, lng) {
      console.log('Show user location:', lat, lng)
    },

    // Update map data sources (placeholder)
    updateMapData(locations, clearedLocations, selectedLocation = null) {
      console.log('Update map data:', locations.length, 'locations,', clearedLocations.length, 'cleared')
    },

    // Cleanup
    destroy() {
      if (this.locationMarker) {
        this.locationMarker = null
      }
      
      if (this.map) {
        this.map = null
      }
      
      this.mapReady = false
      this.selectedLocationId = null
    }
  }
})
