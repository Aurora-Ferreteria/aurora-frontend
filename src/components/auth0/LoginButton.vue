<script setup lang="ts">
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect } = useAuth0()

// Variable reactiva para almacenar el token de Turnstile
const turnstileToken = ref<string>('')
const cargando = ref<boolean>(false)

// Exponemos la función de callback al objeto global window para que Cloudflare la encuentre
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).onTurnstileSuccess = (token: string) => {
  console.log('¡Validación visual de Turnstile completada con éxito!')
  turnstileToken.value = token
}

const handleLogin = async () => {
  // 1. Verificamos que el usuario haya resuelto la cajita visible antes de hacer nada
  if (!turnstileToken.value) {
    alert('Por favor, espera a que se complete la verificación de seguridad de Cloudflare.')
    return
  }

  cargando.value = true

  try {
    // 2. Enviamos el token a tu API Gateway (Zuplo) para la validación perimetral
    // TODO: Reemplaza esta URL con la de tu entorno real en Zuplo
    const respuesta = await fetch('https://aurora-main-2fde2ca.zuplo.app/auth/verify-turnstile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: turnstileToken.value }),
    })

    const data = await respuesta.json()

    // 3. Evaluamos la decisión de Zuplo
    if (respuesta.ok && data.success) {
      // ¡Luz verde! Es un humano comprobado. Abrimos Auth0 de forma segura.
      loginWithRedirect({
        appState: {
          target: '/home',
        },
      })
    } else {
      alert('La validación de seguridad falló. Por favor, recarga la página e intenta nuevamente.')
    }
  } catch (error) {
    console.error('Error al conectar con el API Gateway:', error)
    alert('Ocurrió un error al verificar la seguridad de la sesión.')
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="d-flex flex-column align-items-center gap-3">
    <div
      class="cf-turnstile"
      data-sitekey="0x4AAAAAADL65mu7JwCFEVht"
      data-callback="onTurnstileSuccess"
    ></div>

    <button
      class="btn btn-outline-secondary px-4 py-2 fw-semibold shadow-sm"
      @click="handleLogin"
      :disabled="cargando"
    >
      {{ cargando ? 'Verificando...' : 'Log In' }}
    </button>
  </div>
</template>

<style scoped>
.btn-outline-secondary:hover {
  color: #6366f1 !important;
  border-color: #6366f1 !important;
}
</style>
