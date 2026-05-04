<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink to="/perfil" class="btn btn-primary px-4 py-2 fw-semibold shadow-sm">
    Perfil
  </RouterLink>
</template>

<style scoped>
/* El color bg-indigo-500 de Tailwind es muy parecido al btn-primary de Bootstrap */
.btn-primary {
  background-color: #6366f1; /* Color índigo de tu React original */
  border-color: #6366f1;
}

.btn-primary:hover {
  background-color: #4f46e5;
  border-color: #4f46e5;
}
</style>
