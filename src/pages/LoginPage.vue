<template>
  <div style="background: #0D2416; min-height: 100vh; padding: 40px; display: flex; justify-content: center; align-items: center;">
    <div style="background: rgba(18,45,28,0.96); padding: 40px; border-radius: 10px; min-width: 360px; text-align: center; border: 1px solid rgba(201,168,76,0.3);">
      <!-- Logo -->
      <div style="color: #C9A84C; font-size: 32px; font-weight: 600; margin-bottom: 8px;">
        Earth<em style="font-style: italic;">keeper</em>
      </div>
      
      <!-- Subtitle -->
      <div style="color: rgba(232,213,160,.55); font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 30px;">
        UK Energy Clearing Tracker
      </div>
      
      <!-- Form -->
      <div style="margin-bottom: 20px;">
        <input 
          v-model="name" 
          placeholder="Your full name (e.g. Anthony Gorman)" 
          style="width: 100%; padding: 12px; background: #2D4A3A; border: 1px solid #C9A84C; border-radius: 4px; color: white; margin-bottom: 15px;"
        />
        
        <input 
          v-model="password" 
          type="password" 
          placeholder="Password" 
          style="width: 100%; padding: 12px; background: #2D4A3A; border: 1px solid #C9A84C; border-radius: 4px; color: white; margin-bottom: 15px;"
        />
        
        <!-- Tool Selection -->
        <select 
          v-model="tool"
          style="width: 100%; padding: 12px; background: #2D4A3A; border: 1px solid #C9A84C; border-radius: 4px; color: white; margin-bottom: 15px;"
        >
          <option value="MS">Magical Structures (MS)</option>
          <option value="MF">Multifrequency (MF)</option>
          <option value="O">Omega (O)</option>
          <option value="J">Jewel (J)</option>
          <option value="MG" selected>Merlin's Grace (MG)</option>
          <option value="AP">Universal AP (AP)</option>
          <option value="MI">Manifesting Intention (MI)</option>
          <option value="MJ">Magical Jewel (MJ)</option>
          <option value="DM">Divine Magic (DM)</option>
        </select>
        
        <!-- Earthworks checkbox -->
        <div style="text-align: left; margin-bottom: 20px;">
          <label style="color: #C9A84C; cursor: pointer;">
            <input type="checkbox" v-model="hasEarthworks" style="margin-right: 8px;"/>
            I have Earthworks tools (EW1–5)
          </label>
        </div>
        
        <q-btn 
          color="orange" 
          label="Enter"
          style="width: 100%; margin-bottom: 10px;"
          @click="doLogin"
          :loading="loading"
        />
        
        <q-btn 
          flat 
          color="grey" 
          label="Back to Home" 
          style="width: 100%;"
          @click="goBack"
        />
      </div>
      
      <div v-if="error" style="color: #ff6b6b; margin-top: 15px; font-size: 14px;">{{ error }}</div>
      <div v-if="message" style="color: #C9A84C; margin-top: 15px; font-size: 14px;">{{ message }}</div>
      
      <!-- Instructions link -->
      <div style="margin-top: 20px;">
        <a href="https://londrovski.github.io/earthkeeper/instructions.html" 
           target="_blank" 
           style="color: rgba(232,213,160,.55); font-size: 12px; text-decoration: none;">
          New here? Read the instructions →
        </a>
      </div>
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
      tool: 'MG',
      hasEarthworks: false,
      error: '',
      message: '',
      loading: false
    }
  },
  methods: {
    async doLogin() {
      this.loading = true
      this.error = ''
      this.message = ''
      
      try {
        // Hash the password using SHA-256
        const encoder = new TextEncoder()
        const data = encoder.encode(this.password)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        
        // Check against the real Earthkeeper password hash
        const correctHash = '74e6fbb572af72246abf610d8e268ae53e6599972c571117503dc4537b982b69'
        
        if (hashHex === correctHash) {
          this.message = `Welcome ${this.name}! Loading your data...`
          
          // Save complete login state
          localStorage.setItem('ek2_logged_in', 'true')
          localStorage.setItem('ek2_user', this.name)
          localStorage.setItem('ek2_tool', this.tool)
          localStorage.setItem('ek2_has_earthworks', this.hasEarthworks.toString())
          localStorage.setItem('ek2_login_date', new Date().toISOString())
          
          // Redirect after delay
          setTimeout(() => {
            window.location.href = '/'
          }, 1500)
        } else {
          this.error = 'Incorrect password. Please try again.'
        }
      } catch (e) {
        this.error = 'Login failed. Please try again.'
        console.error('Login error:', e)
      } finally {
        this.loading = false
      }
    },
    goBack() {
      window.location.href = '/'
    }
  }
})
</script>