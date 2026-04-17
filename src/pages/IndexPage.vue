<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Earthkeeper 2.0
        </q-toolbar-title>
        
        <q-space />
        
        <q-btn flat @click="showLogin = !showLogin">
          {{ authStore.isAuthenticated ? authStore.currentUser : 'Login' }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <q-page class="flex flex-center">
        <div v-if="!authStore.isAuthenticated" class="text-center">
          <h2>Welcome to Earthkeeper 2.0</h2>
          <p>Please log in to access the application</p>
          <q-btn color="primary" label="Go to Login" @click="$router.push('/login')" />
        </div>
        
        <div v-else class="text-center q-pa-md">
          <h2>Welcome back, {{ authStore.currentUser }}!</h2>
          
          <div class="q-mt-md">
            <q-card class="q-pa-md">
              <h4>Application Status</h4>
              <p><strong>Locations loaded:</strong> {{ locationStore.locations.length.toLocaleString() }}</p>
              <p><strong>Loading:</strong> {{ locationStore.isLoading ? 'Yes' : 'No' }}</p>
              <p><strong>Tool:</strong> {{ authStore.currentTool }}</p>
              
              <div class="q-mt-md q-gutter-sm">
                <q-btn color="primary" @click="loadData" :loading="locationStore.isLoading">
                  Load Data
                </q-btn>
                <q-btn color="secondary" @click="authStore.logout">
                  Logout
                </q-btn>
              </div>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'
import { useLocationStore } from '../stores/location-store'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const authStore = useAuthStore()
    const locationStore = useLocationStore()
    const showLogin = ref(false)

    const loadData = async () => {
      try {
        $q.notify({ message: 'Starting data load...', color: 'info' })
        await locationStore.initializeApp()
        $q.notify({ 
          message: `Successfully loaded ${locationStore.locations.length.toLocaleString()} locations!`,
          color: 'positive'
        })
      } catch (error) {
        $q.notify({
          message: 'Failed to load data: ' + error.message,
          color: 'negative'
        })
      }
    }

    onMounted(() => {
      // Check for existing session
      authStore.checkExistingSession()
    })

    return {
      authStore,
      locationStore,
      showLogin,
      loadData
    }
  }
})
</script>
