import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // Login page first
  {
    path: '/login',
    name: 'login', 
    component: () => import('../pages/LoginPage.vue')
  },
  
  // Simple working home page 
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/IndexPage.vue')
  },

  // Test page
  {
    path: '/test',
    name: 'test',
    component: () => import('../pages/TestPage.vue')
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
