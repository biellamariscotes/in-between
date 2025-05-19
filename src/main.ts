import './assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import 'element-plus/es/components/notification/style/css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Navigation Guard
router.beforeEach((to, from, next) => {
  const hasPlayers = 'players' in localStorage

  const publicPaths = ['/', '/choose-player', '/registration']
  const isPublic = publicPaths.includes(to.path)
  const isProtected = to.path === '/game-zone'

  // Block access to protected route
  if (isProtected && !hasPlayers) {
    if (to.path !== '/') {
      return next('/')
    } else {
      return next() // Already at '/', let it load
    }
  }

  if (isPublic && hasPlayers) {
    if (to.path !== '/game-zone') {
      return next('/game-zone')
    }
    return next()
  }

  return next()
})

app.use(ElementPlus)

app.mount('#app')
