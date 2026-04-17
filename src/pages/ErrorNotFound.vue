<template>
  <div class="fullscreen bg-forest flex flex-center">
    <div style="font-size: 30vh" class="text-gold">
      404
    </div>
    <div class="text-center q-ml-xl">
      <div class="text-h2 text-ink q-mb-md">
        Oops. Nothing here...
      </div>
      <q-btn
        color="gold"
        text-color="forest"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>

<style lang="scss" scoped>
.bg-forest {
  background: var(--forest);
}

.text-gold {
  color: var(--gold);
}

.text-ink {
  color: var(--ink);
}
</style>