<template>
  <div class="fullscreen bg-dark column justify-center items-center">
    <div class="text-h3 text-orange q-mb-lg">Earthkeeper 2.0</div>
    <div class="text-subtitle2 text-grey-5 q-mb-xl">UK Energy Clearing Tracker</div>
    
    <q-card dark class="q-pa-lg" style="min-width: 300px;">
      <div class="text-h6 q-mb-md">Login</div>
      
      <q-input 
        v-model="name" 
        label="Your Name" 
        dark 
        filled 
        class="q-mb-md"
      />
      
      <q-input 
        v-model="password" 
        label="Password" 
        type="password" 
        dark 
        filled 
        class="q-mb-md"
      />
      
      <q-btn 
        color="orange" 
        label="Login" 
        class="full-width q-mb-md"
        @click="doLogin"
        :loading="loading"
      />
      
      <q-btn 
        flat
        color="grey" 
        label="Back to Home" 
        class="full-width"
        @click="$router.push('/')"
      />
      
      <div v-if="error" class="text-negative q-mt-md">{{ error }}</div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      name: '',
      password: '',
      loading: false,
      error: ''
    }
  },
  methods: {
    async doLogin() {
      this.loading = true
      this.error = ''
      
      try {
        // Simple test login
        if (this.password === 'test') {
          this.$q.notify({
            message: `Welcome ${this.name}!`,
            color: 'positive'
          })
          this.$router.push('/')
        } else {
          this.error = 'Try password: test'
        }
      } catch (e) {
        this.error = 'Login failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
