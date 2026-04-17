<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Earthkeeper 2.0 - Debug
        </q-toolbar-title>
        
        <q-space />
        
        <q-btn flat>
          Debug Mode
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="text-center">
          <h2>Earthkeeper 2.0 is Loading!</h2>
          <p>This is the minimal working version.</p>
          
          <div class="q-mt-md">
            <q-card class="q-pa-md">
              <h4>Debug Info</h4>
              <p>✅ Quasar is working</p>
              <p>✅ Router is working</p>
              <p>✅ Vue 3 is working</p>
              
              <div class="q-mt-md q-gutter-sm">
                <q-btn color="primary" @click="testNotify">
                  Test Notification
                </q-btn>
                <q-btn color="secondary" to="/login">
                  Go to Login
                </q-btn>
                <q-btn color="accent" to="/test">
                  Go to Test Page
                </q-btn>
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
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const $q = useQuasar()

    const testNotify = () => {
      $q.notify({
        message: 'Quasar notifications work!',
        color: 'positive',
        icon: 'check'
      })
    }

    return {
      testNotify
    }
  }
})
</script>
