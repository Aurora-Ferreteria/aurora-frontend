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
    domain: 'aurorajk.us.auth0.com', // <--- Reemplaza esto
    clientId: 'eSZ0yEOHkDgpI3EDbGvLepreJbGEQc9d', // <--- Reemplaza esto
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  }),
)

app.mount('#app')
