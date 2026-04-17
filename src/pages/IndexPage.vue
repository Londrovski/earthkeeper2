<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Earthkeeper 2.0
        </q-toolbar-title>
        
        <q-space />
        
        <q-btn flat @click="handleAuth">
          {{ isLoggedIn ? currentUser : 'Login' }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <q-page class="flex flex-center">
        <div v-if="!isLoggedIn" class="text-center">
          <h2>Welcome to Earthkeeper 2.0</h2>
          <p>Please log in to access the application</p>
          <q-btn color="primary" label="Go to Login" @click="goToLogin" />
        </div>
        
        <div v-else class="text-center q-pa-md">
          <h2>Welcome back, {{ currentUser }}!</h2>
          
          <div class="q-mt-md">
            <q-card class="q-pa-md">
              <h4>🎉 Login System Works!</h4>
              <p><strong>User:</strong> {{ currentUser }}</p>
              <p><strong>Status:</strong> Logged In</p>
              <p><strong>System:</strong> Quasar + Vue 3</p>
              
              <div class="q-mt-md q-gutter-sm">
                <q-btn color="secondary" @click="logout" label="Logout" />
                <q-btn color="accent" @click="goToTest" label="Test Page" />
              </div>
              
              <div class="q-mt-md">
                <p class="text-caption"><strong>Next steps:</strong></p>
                <p class="text-caption">• Add real password hash (74e6fbb...)</p>
                <p class="text-caption">• Load GitHub data (~37K locations)</p>
                <p class="text-caption">• Build full interface step by step</p>
              </div>
            </q-card>
          </div>
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
      isLoggedIn: false,
      currentUser: ''
    }
  },

  mounted() {
    // Check login state from localStorage
    this.checkLoginState()
  },

  methods: {
    checkLoginState() {
      this.isLoggedIn = localStorage.getItem('ek2_logged_in') === 'true'
      this.currentUser = localStorage.getItem('ek2_user') || ''
    },

    handleAuth() {
      if (this.isLoggedIn) {
        this.logout()
      } else {
        this.goToLogin()
      }
    },

    goToLogin() {
      window.location.href = '/login'
    },

    goToTest() {
      window.location.href = '/test'
    },

    logout() {
      localStorage.removeItem('ek2_logged_in')
      localStorage.removeItem('ek2_user')
      this.isLoggedIn = false
      this.currentUser = ''
    }
  }
})
</script>
