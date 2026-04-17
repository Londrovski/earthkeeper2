<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
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
        <div class="row items-center q-gutter-lg gt-sm" v-if="authStore.isAuthenticated">
          <div class="text-center">
            <div class="text-h6 text-gold">{{ locationStore.totalLocations.toLocaleString() }}</div>
            <div class="text-caption text-soft">locations</div>
          </div>
          <div class="text-center">
            <div class="text-h6 text-gold">{{ locationStore.clearedLocations }}</div>
            <div class="text-caption text-soft">cleared</div>
          </div>
          <div class="text-center">
            <div class="text-h6 text-gold">{{ locationStore.progressPercent }}%</div>
            <div class="text-caption text-soft">done</div>
          </div>
        </div>

        <!-- User menu -->
        <div v-if="authStore.isAuthenticated" class="q-ml-md">
          <q-btn-dropdown flat no-caps :label="authStore.currentUser">
            <q-list>
              <q-item clickable v-close-popup @click="logout">
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
      :mini="!leftDrawerOpen || $q.screen.lt.md"
      mini-to-overlay
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

      <!-- Tab content -->
      <div class="q-pa-md">
        <LocationsTab v-if="activeTab === 'locations'" />
        <GroupsTab v-else-if="activeTab === 'groups'" />
        <LogTab v-else-if="activeTab === 'log'" />
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Mobile Bottom Navigation -->
    <q-footer v-if="$q.screen.lt.md && authStore.isAuthenticated" class="bg-forest-m border-t border-gold-glow">
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'
import { useLocationStore } from '../stores/location-store'
import LocationsTab from '../components/LocationsTab.vue'
import GroupsTab from '../components/GroupsTab.vue'
import LogTab from '../components/LogTab.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    LocationsTab,
    GroupsTab,
    LogTab
  },

  setup () {
    const router = useRouter()
    const leftDrawerOpen = ref(false)
    const activeTab = ref('locations')
    const authStore = useAuthStore()
    const locationStore = useLocationStore()

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const logout = () => {
      authStore.logout()
      router.push('/login')
    }

    return {
      leftDrawerOpen,
      activeTab,
      authStore,
      locationStore,
      toggleLeftDrawer,
      logout
    }
  }
})
</script>

<style lang="scss" scoped>
.border-t {
  border-top: 1px solid;
}

.border-gold-glow {
  border-color: var(--gold-glow);
}

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
