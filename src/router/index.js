import { createRouter, createWebHashHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  // Login page (standalone, not inside MainLayout)
  {
    path: '/login',
    name: 'login', 
    component: () => import('../pages/LoginPage.vue')
  },
  
  // Main app (requires authentication)
  {
    path: '/',
    component: MainLayout,
    children: [
      { 
        path: '', 
        name: 'home',
        component: () => import('../pages/IndexPage.vue') 
      }
    ]
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
]

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(),
  routes
})

export default Router
