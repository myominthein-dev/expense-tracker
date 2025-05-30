import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path : '/history',
      name : 'auth',
      component : () => import('../views/HistoryView.vue')
    },
    {
      path : '/guest',
      name : 'guest',
      component : () => import('../views/GuestView.vue')
    }
  ],
})

export default router
