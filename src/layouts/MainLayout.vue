<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-forest-m text-ink">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="lt-md"
        />

        <div class="row items-center no-wrap">
          <q-avatar size="42px" class="q-mr-sm">
            <img src="/earthkeeper-circular.png" alt="Earthkeeper">
          </q-avatar>
          <div class="ek-logo text-h5">
            Earth<em>keeper</em>
          </div>
        </div>

        <q-space />

        <!-- Desktop Stats -->
        <div class="row items-center q-gutter-lg gt-sm">
          <div class="text-center">
            <div class="text-h6 text-gold">1,234</div>
            <div class="text-caption text-soft">locations</div>
          </div>
          <div class="text-center">
            <div class="text-h6 text-gold">456</div>
            <div class="text-caption text-soft">cleared</div>
          </div>
          <div class="text-center">
            <div class="text-h6 text-gold">37%</div>
            <div class="text-caption text-soft">done</div>
          </div>
        </div>

        <!-- User menu -->
        <div class="q-ml-md">
          <q-btn-dropdown flat no-caps label="James Morris">
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Sign out</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer (Mobile) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-forest-m"
      :width="280"
    >
      <q-tabs
        v-model="activeTab"
        vertical
        class="text-soft"
        active-color="gold"
        indicator-color="gold"
      >
        <q-tab name="locations" icon="place" label="Locations" />
        <q-tab name="groups" icon="groups" label="Groups" />
        <q-tab name="log" icon="history" label="Log" />
      </q-tabs>

      <q-separator />

      <div class="q-pa-md">
        <div class="text-caption text-soft">Tab content coming soon...</div>
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Mobile Bottom Navigation -->
    <q-footer v-if="$q.screen.lt.md" class="bg-forest-m">
      <q-tabs
        v-model="activeTab"
        dense
        class="text-soft"
        active-color="gold"
        indicator-color="gold"
      >
        <q-tab name="locations" icon="place" label="Locations" />
        <q-tab name="groups" icon="groups" label="Groups" />  
        <q-tab name="log" icon="history" label="Log" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)
    const activeTab = ref('locations')

    return {
      leftDrawerOpen,
      activeTab,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.bg-forest-m {
  background: var(--forest-m);
}

.text-soft {
  color: var(--soft);
}

.text-gold {
  color: var(--gold);
}

.text-ink {
  color: var(--ink);
}
</style>