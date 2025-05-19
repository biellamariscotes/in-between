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
// router.beforeEach((to, from, next) => {
//   if (to.path === '/game-zone' && !('players' in localStorage)) {
//     return next('/')
//   } else if (
//     to.path === '/' ||
//     to.path === '/choose-player' ||
//     (to.path === '/registration' && 'players' in localStorage)
//   ) {
//     return next('/game-zone')
//   }
//   next()
// })

app.use(ElementPlus)

app.mount('#app')
