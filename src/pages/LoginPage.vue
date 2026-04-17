<template>
  <div style="background: #0D2416; min-height: 100vh; padding: 40px; display: flex; justify-content: center; align-items: center;">
    <div style="background: rgba(18,45,28,0.96); padding: 40px; border-radius: 10px; min-width: 300px; text-align: center;">
      <h2 style="color: #C9A84C; margin-bottom: 30px;">Earthkeeper 2.0</h2>
      
      <div style="margin-bottom: 20px;">
        <input 
          v-model="name" 
          placeholder="Your Name" 
          style="width: 100%; padding: 12px; background: #2D4A3A; border: 1px solid #C9A84C; border-radius: 4px; color: white; margin-bottom: 15px;"
        />
        
        <input 
          v-model="password" 
          type="password" 
          placeholder="Password" 
          style="width: 100%; padding: 12px; background: #2D4A3A; border: 1px solid #C9A84C; border-radius: 4px; color: white; margin-bottom: 15px;"
        />
        
        <q-btn 
          color="orange" 
          label="Login" 
          style="width: 100%; margin-bottom: 10px;"
          @click="doLogin"
        />
        
        <q-btn 
          flat 
          color="grey" 
          label="Back" 
          style="width: 100%;"
          @click="goBack"
        />
      </div>
      
      <div v-if="error" style="color: red; margin-top: 15px;">{{ error }}</div>
      <div v-if="message" style="color: #C9A84C; margin-top: 15px;">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginPage',
  data() {
    return {
      name: '',
      password: '',
      error: '',
      message: ''
    }
  },
  methods: {
    doLogin() {
      this.error = ''
      this.message = ''
      
      if (this.password === 'test') {
        this.message = `Welcome ${this.name}! Redirecting...`
        
        // Save login state to localStorage
        localStorage.setItem('ek2_logged_in', 'true')
        localStorage.setItem('ek2_user', this.name)
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else {
        this.error = 'Try password: test'
      }
    },
    goBack() {
      window.location.href = '/'
    }
  }
})
</script>
