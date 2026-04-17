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
        <div class="text-center text-soft">
          Login functionality coming soon...
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginPage'
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