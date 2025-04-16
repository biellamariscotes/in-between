import { createRouter, createWebHistory } from 'vue-router'
import RegistrationLayout from '@/layout/RegistrationLayout.vue'
import GameLayout from '@/layout/GameLayout.vue'
import NotFoundPageView from '@/views/empty/NotFoundPageView.vue'

const routes = [
  {
    path: '/',
    component: RegistrationLayout,
    children: [
      {
        path: '/',
        name: 'landing-page',
        component: () => import('@/views/LandingPageView.vue'),
        meta: { title: 'In-Between', style: 'landing.scss', requireGuest: true },
      },
      {
        path: '/choose-player',
        name: 'choose-player',
        component: () => import('@/views/registration/ChoosePlayer.vue'),
        meta: {
          title: 'Choose Player',
          style: 'registration/choose-player.scss',
          requireGuest: true,
        },
      },
      {
        path: '/registration',
        name: 'registration',
        component: () => import('@/views/registration/RegistrationView.vue'),
        meta: { title: 'Register Player', style: 'registration.scss', requireGuest: true },
      },
    ],
  },
  {
    path: '/game-zone',
    component: GameLayout,
    children: [
      {
        path: '/game-zone',
        name: 'game-zone',
        component: () => import('@/views/in-game/GameZoneView.vue'),
        meta: { title: 'In-Between', style: 'gameZone.scss', requireGuest: true },
      },
    ],
  },
  // Add a catch-all route for undefined paths
  {
    path: '/:pathMatch(.*)*', // Catch-all route
    name: 'not-found',
    component: NotFoundPageView,
    meta: { title: 'Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
