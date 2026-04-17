<template>
  <q-page class="flex flex-center bg-forest">
    <!-- Background -->
    <div class="fixed-full flex flex-center">
      <q-img 
        src="/earthkeeper-circular.png" 
        style="width: 100vmax; height: 100vmax; opacity: 0.07; filter: blur(1px);"
        class="rounded-full"
      />
    </div>
    
    <!-- Radial glow -->
    <div class="fixed-full" style="background: radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 65%);"></div>

    <!-- Login Card -->
    <q-card 
      class="login-card relative-position" 
      style="width: 360px; background: rgba(18,45,28,0.96); border: 1px solid var(--gold-glow);"
    >
      <q-card-section class="text-center">
        <!-- Seal -->
        <q-avatar size="130px" class="q-mb-md">
          <img src="/earthkeeper-circular.png" alt="Earthkeeper">
        </q-avatar>

        <!-- Logo -->
        <div class="ek-logo text-h4 q-mb-xs">
          Earth<em>keeper</em>
        </div>
        
        <!-- Subtitle -->
        <div class="text-caption text-soft text-uppercase letter-spacing">
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
            color="gold"
            dark
          />

          <!-- Submit button -->
          <q-btn
            type="submit"
            label="Enter"
            color="gold-d"
            text-color="forest"
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

      <!-- Instructions link -->
      <q-card-section>
        <q-btn
          flat
          label="New here? Read the instructions"
          color="soft"
          class="full-width"
          size="sm"
          @click="openInstructions"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'

export default defineComponent({
  name: 'LoginPage',

  setup () {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isLoading = ref(false)
    const errorMessage = ref('')
    
    const formData = ref({
      name: '',
      password: '',
      tool: 'MG', // Default to Merlin's Grace
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
        const success = await authStore.login(
          formData.value.name,
          formData.value.password,
          formData.value.tool,
          formData.value.hasEarthworks
        )

        if (success) {
          router.push('/')
        } else {
          errorMessage.value = 'Incorrect password'
        }
      } catch (error) {
        errorMessage.value = 'Login failed. Please try again.'
        console.error('Login error:', error)
      } finally {
        isLoading.value = false
      }
    }

    const openInstructions = () => {
      window.open('https://londrovski.github.io/earthkeeper/instructions.html', '_blank')
    }

    // Check if already authenticated
    onMounted(() => {
      if (authStore.checkExistingSession()) {
        router.push('/')
      }
    })

    return {
      formData,
      toolOptions,
      isLoading,
      errorMessage,
      onSubmit,
      openInstructions
    }
  }
})
</script>

<style lang="scss" scoped>
.login-card {
  box-shadow: 0 8px 64px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
}

.letter-spacing {
  letter-spacing: 0.15em;
}

.bg-forest {
  background: var(--forest);
}

.text-soft {
  color: var(--soft);
}
</style>
