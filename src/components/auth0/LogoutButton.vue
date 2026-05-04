<script setup lang="ts">
// 1. Usamos el hook de la librería de Vue
import { useAuth0 } from '@auth0/auth0-vue'

const { logout } = useAuth0()

const handleLogout = () => {
  // 2. Definimos los parámetros de salida
  logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  })
}
</script>

<template>
  <button class="btn btn-outline-danger px-4 py-2 fw-semibold shadow-sm" @click="handleLogout">
    Log Out
  </button>
</template>

<style scoped>
/* Estilos adicionales si quieres personalizar el comportamiento de Bootstrap */
.btn-outline-danger {
  transition: all 0.2s ease-in-out;
}
</style>
