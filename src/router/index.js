import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // Simple test route
  {
    path: '/',
    name: 'test',
    component: () => import('../pages/TestPage.vue')
  },
  
  // Login page (standalone, not inside MainLayout)
  {
    path: '/login',
    name: 'login', 
    component: () => import('../pages/LoginPage.vue')
  },
  
  // Main app (requires authentication)
  {
    path: '/app',
    name: 'app',
    component: () => import('../layouts/MainLayout.vue'),
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
