<script setup lang="ts">
import LoginButton from '../components/auth0/LoginButton.vue'
import RegistroButton from '../components/auth0/RegistroButton.vue'
</script>

<template>
  <!-- Contenedor principal que ocupa toda la pantalla -->
  <div
    class="login-container d-flex flex-column align-items-center justify-content-center vh-100 bg-white"
  >
    <!-- Título con la sombra de tu imagen -->
    <h1 class="title-main mb-5">Inicio de sesión</h1>

    <!-- Texto descriptivo con el estilo de Aurora -->
    <p class="description-text mb-4">
      Ingresa tus credenciales para iniciar sesión en <span class="aurora-brand">Aurora</span>
    </p>

    <!-- Botón principal de Auth0 (Donde estaba "Iniciar sesio") -->
    <div class="main-action-wrapper mb-5">
      <LoginButton />
    </div>

    <!-- Botones inferiores (Signup y Login pequeño) para mantener el diseño visual -->
    <div class="bottom-actions d-flex gap-2 mt-5">
      <RegistroButton />
      <!-- Aquí puedes repetir el LoginButton o dejar solo el Registro según prefieras -->
    </div>
  </div>
</template>

<style scoped>
.login-container {
  text-align: center;
  font-family: sans-serif;
}

/* Sombra suave y tamaño del título principal */
.title-main {
  font-size: 4rem;
  font-weight: 400;
  color: #333;
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  margin-top: -50px; /* Ajuste para centrar visualmente */
}

.description-text {
  font-size: 1.2rem;
  color: #666;
}

/* Color exacto para la marca Aurora en tu diseño */
.aurora-brand {
  color: #6a11cb; /* Morado/Índigo intenso */
  font-weight: bold;
}

/* Estilizamos los componentes de Auth0 para que se vean como tus botones */
:deep(.btn) {
  border-radius: 6px;
  padding: 10px 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* El botón de arriba (el azul grande de tu imagen) */
.main-action-wrapper :deep(.btn) {
  background-color: #0d6efd; /* Azul Bootstrap */
  border: none;
  color: white;
  font-size: 1.1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

/* Botones inferiores pequeños */
.bottom-actions :deep(.btn) {
  font-size: 0.9rem;
}

/* Si quieres que el de registro sea azul como tu botón "Signup" */
.bottom-actions :deep(.btn-secondary),
.bottom-actions :deep(.btn-primary) {
  min-width: 100px;
}
</style>
