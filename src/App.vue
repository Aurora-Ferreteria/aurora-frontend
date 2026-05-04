<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { watch } from 'vue'
import NavBar from './components/NavBar.vue'
const { isAuthenticated, isLoading, error } = useAuth0()

// VIGILANTE DE ERRORES: Esto soluciona el bloqueo de los botones
watch(error, (newError) => {
  if (newError) {
    // Si el error es el que configuramos en la Action de Auth0
    if (newError.message.includes('verifica')) {
      alert(
        '📧 ¡Correo no verificado! \nTe hemos enviado un enlace a tu bandeja de entrada. Por favor confírmalo para poder ingresar.',
      )
    } else {
      alert('Error de autenticación: ' + newError.message)
    }

    // IMPORTANTE: Recargamos la página o redirigimos al login
    // para limpiar el error de la URL y desbloquear los botones.
    window.location.href = window.location.origin
  }
})
</script>

<template>
  <div
    v-if="isLoading"
    class="d-flex flex-column align-items-center justify-content-center vh-100 text-center"
  >
    <div class="h2 font-weight-bold mb-3">Redireccionando...</div>
    <div class="spinner-border text-primary" role="status"></div>
  </div>

  <div v-else>
    <NavBar v-if="isAuthenticated" />

    <main :class="{ 'container mt-4': isAuthenticated }">
      <RouterView />
    </main>
  </div>
</template>

<style>
body {
  background-color: #f8f9fa; /* Un gris muy claro típico de Bootstrap */
}
</style>
