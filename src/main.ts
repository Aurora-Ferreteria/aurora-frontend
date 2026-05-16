import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue' // 1. Importamos Auth0

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 2. Configuramos Auth0 (¡ESTO ES LO QUE HACE QUE LOS BOTONES FUNCIONEN!)
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN, // <--- Reemplaza esto
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID, // <--- Reemplaza esto
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    },
  }),
)

app.mount('#app')
