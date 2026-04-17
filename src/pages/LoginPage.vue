<template>
  <q-page class="flex flex-center" style="background: #0D2416;">
    <!-- Login Card -->
    <q-card 
      class="login-card" 
      style="width: 360px; background: rgba(18,45,28,0.96);"
    >
      <q-card-section class="text-center">
        <!-- Logo -->
        <div style="color: #C9A84C; font-size: 28px; font-weight: 600;">
          Earth<em style="font-style: italic;">keeper</em>
        </div>
        
        <!-- Subtitle -->
        <div style="color: rgba(232,213,160,.55); font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 8px;">
          UK Energy Clearing Tracker
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- Name -->
          <q-input
            v-model="formData.name"
            label="Your full name"
            placeholder="e.g. Anthony Gorman"
            filled
            dark
            :rules="[val => val && val.length > 0 || 'Please enter your name']"
          />

          <!-- Password -->
          <q-input
            v-model="formData.password"
            label="Password"
            placeholder="••••••••"
            type="password"
            filled
            dark
            :rules="[val => val && val.length > 0 || 'Please enter the password']"
          />

          <!-- Tool Selection -->
          <q-select
            v-model="formData.tool"
            label="Default clearing tool"
            :options="toolOptions"
            emit-value
            map-options
            filled
            dark
            :rules="[val => val || 'Please select your tool']"
          />

          <!-- Earthworks checkbox -->
          <q-checkbox
            v-model="formData.hasEarthworks"
            label="I have Earthworks tools (EW1–5)"
            color="orange"
            dark
          />

          <!-- Submit button -->
          <q-btn
            type="submit"
            label="Enter"
            color="orange"
            class="full-width"
            size="md"
            :loading="isLoading"
          />
        </q-form>
      </q-card-section>

      <!-- Error message -->
      <q-card-section v-if="errorMessage" class="text-center">
        <div class="text-negative text-body2">{{ errorMessage }}</div>
      </q-card-section>

      <!-- Test buttons -->
      <q-card-section>
        <div class="q-gutter-sm">
          <q-btn
            flat
            label="Test Login"
            color="grey"
            class="full-width"
            size="sm"
            @click="testLogin"
          />
          <q-btn
            flat
            label="Back to Home"
            color="grey"
            class="full-width"
            size="sm"
            @click="$router.push('/')"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'LoginPage',

  setup () {
    const router = useRouter()
    const $q = useQuasar()
    
    const isLoading = ref(false)
    const errorMessage = ref('')
    
    const formData = ref({
      name: '',
      password: '',
      tool: 'MG',
      hasEarthworks: false
    })

    const toolOptions = [
      { label: 'Magical Structures (MS)', value: 'MS' },
      { label: 'Multifrequency (MF)', value: 'MF' },
      { label: 'Omega (O)', value: 'O' },
      { label: 'Jewel (J)', value: 'J' },
      { label: 'Merlin\'s Grace (MG)', value: 'MG' },
      { label: 'Universal AP (AP)', value: 'AP' },
      { label: 'Manifesting Intention (MI)', value: 'MI' },
      { label: 'Magical Jewel (MJ)', value: 'MJ' },
      { label: 'Divine Magic (DM)', value: 'DM' }
    ]

    const onSubmit = async () => {
      isLoading.value = true
      errorMessage.value = ''

      try {
        // Simple password test (we'll implement real auth later)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Fake delay
        
        if (formData.value.password === 'test') {
          $q.notify({
            message: `Welcome ${formData.value.name}!`,
            color: 'positive'
          })
          router.push('/')
        } else {
          errorMessage.value = 'Incorrect password (try "test" for now)'
        }
      } catch (error) {
        errorMessage.value = 'Login failed. Please try again.'
        console.error('Login error:', error)
      } finally {
        isLoading.value = false
      }
    }

    const testLogin = () => {
      formData.value.name = 'Test User'
      formData.value.password = 'test'
      $q.notify({
        message: 'Form filled with test data',
        color: 'info'
      })
    }

    return {
      formData,
      toolOptions,
      isLoading,
      errorMessage,
      onSubmit,
      testLogin
    }
  }
})
</script>

<style lang="scss" scoped>
.login-card {
  box-shadow: 0 8px 64px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}
</style>
