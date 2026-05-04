<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

import LogoutButton from './auth0/LogoutButton.vue'
import ProfileButton from './auth0/ProfileButton.vue'

const { isAuthenticated } = useAuth0()
</script>

<template>
  <div class="d-flex" v-if="isAuthenticated">
    <nav class="sidebar bg-body-tertiary p-3">
      <h1 class="navbar-brand aurora fs-1 fw-bold mb-4" href="#">Aurora</h1>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/home" class="bi bi-house nav-link fs-4 fw-bold">Inicio</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/customer" class="bi bi-people nav-link fs-4 fw-bold"
            >Clientes</router-link
          >
        </li>
        <li class="nav-item">
          <a class="bi bi-graph-up nav-link fs-4 fw-bold" href="#"> Ventas</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="bi bi-box nav-link dropdown-toggle fs-4 fw-bold"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Inventario
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item fs-5 fw-bold" href="#">Producto</a></li>
            <li><a class="dropdown-item fs-5 fw-bold" href="#">Marca</a></li>
            <li><a class="dropdown-item fs-5 fw-bold" href="#">Categoria</a></li>
            <li><a class="dropdown-item fs-5 fw-bold" href="#">Lote</a></li>
          </ul>
        </li>
      </ul>

      <div class="position-fixed bottom-0 start-0 mb-4 ms-4 d-flex flex-column gap-2">
        <ProfileButton />
        <LogoutButton />
      </div>
    </nav>
  </div>
</template>

<style scoped>
.aurora {
  font-size: 150%;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
}
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}
main {
  margin-left: 250px;
}
.nav-link {
  color: #333;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #2575fc;
}

.router-link-exact-active {
  color: white !important;
  background-color: #2575fc !important;
  border-radius: 8px;
  padding: 8px 12px;
}
</style>
