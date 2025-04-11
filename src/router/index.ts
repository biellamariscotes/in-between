import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import GameZoneView from '@/views/GameZoneView.vue'
import NotFoundPageView from '@/views/NotFoundPageView.vue'
import LandingPageView from '@/views/LandingPageView.vue'

const routes = [
  {
    path: '/',
    name: 'landing-page',
    component: LandingPageView,
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationView,
  },
  {
    path: '/game-zone',
    name: 'game-zone',
    component: GameZoneView,
  },
  {
    // Catch all route for 404 page
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    component: NotFoundPageView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
