<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect } = useAuth0()

const handleSignUp = () => {
  loginWithRedirect({
    appState: {
      target: '/perfil', // A donde irá después de registrarse
    },
    authorizationParams: {
      // Esta es la clave que activa la pantalla de Registro en Auth0
      screen_hint: 'signup',
    },
  })
}
</script>

<template>
  <button class="btn btn-primary px-4 py-2 fw-semibold shadow-sm" @click="handleSignUp">
    Sign up
  </button>
</template>

<style scoped>
/* Aplicamos el color índigo que tenías en React para mantener la marca */
.btn-primary {
  background-color: #6366f1;
  border-color: #6366f1;
}

.btn-primary:hover {
  background-color: #4f46e5;
  border-color: #4f46e5;
}
</style>
