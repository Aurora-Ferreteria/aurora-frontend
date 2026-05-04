<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect } = useAuth0()

const handleLogin = () => {
  loginWithRedirect({
    appState: {
      target: '/home',
    },
  })
}
</script>

<template>
  <button class="btn btn-outline-secondary px-4 py-2 fw-semibold shadow-sm" @click="handleLogin">
    Log In
  </button>
</template>

<style scoped>
.btn-outline-secondary:hover {
  color: #6366f1 !important;
  border-color: #6366f1 !important;
}
</style>
