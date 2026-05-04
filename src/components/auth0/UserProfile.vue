<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { user, isAuthenticated, isLoading } = useAuth0()
/*const {getAccessTokenSilently } = useAuth0()
const verMiToken = async () => {
  try {
    const token = await getAccessTokenSilently()
    console.log("¡Aquí está el token JWT!", token)
  } catch (error) {
    console.error("Error obteniendo el token", error)
  }
}*/
</script>

<template>
  <div class="profile-page-container">
    <div v-if="isLoading" class="text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2 text-secondary">Cargando perfil...</p>
    </div>

    <div v-else-if="isAuthenticated && user" class="profile-content">
      <h1 class="display-4 fw-bold aurora-text mb-5">Mi Perfil</h1>

      <div class="card profile-card shadow border-0 p-5 text-center">
        <div class="image-wrapper mb-4">
          <img :src="user.picture" :alt="user.name" class="profile-img" />
        </div>

        <h2 class="fw-bold text-dark">{{ user.name }}</h2>
        <p class="fs-5 text-secondary mb-0">
          <i class="bi bi-envelope-heart-fill me-2 color-icon"></i>
          {{ user.email }}
        </p>

        <div class="mt-4 pt-4 border-top">
          <span class="badge rounded-pill bg-light text-primary px-3 py-2">
            Usuario de Aurora
          </span>
        </div>
        <!--<button @click="verMiToken" class="btn btn-sm btn-info mt-3">Ver Token en Consola</button>-->
      </div>
    </div>

    <div v-else class="alert alert-warning mt-5">
      No se ha podido cargar la información de la sesión.
    </div>
  </div>
</template>

<style scoped>
.profile-page-container {
  margin-left: 260px;
  padding: 3rem;
  min-height: 100vh;
  background-color: #fcfaff;
  transition: all 0.3s ease;
}

.aurora-text {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-card {
  max-width: 500px;
  border-radius: 20px;
  background: white;
}

.profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #f0e6ff;
  box-shadow: 0 10px 20px rgba(106, 17, 203, 0.2);
}

.color-icon {
  color: #6a11cb;
}

/* Responsividad para móviles */
@media (max-width: 992px) {
  .profile-page-container {
    margin-left: 0;
    padding: 1.5rem;
  }

  .profile-img {
    width: 120px;
    height: 120px;
  }
}
</style>
