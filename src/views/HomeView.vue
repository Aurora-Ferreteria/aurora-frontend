<script setup lang="ts">
// No necesitas imports pesados aquí para mantenerlo limpio
</script>

<template>
  <div class="home-container p-5">
    <div class="row justify-content-start">
      <div class="col-12 col-lg-10">
        <h1 class="colorinicio display-2 fw-bold mb-4">Inicio</h1>

        <h2 class="display-4 fw-bold text-dark">
          Bienvenido a <span class="aurora-text">Aurora</span>, software de administración de
          inventario para ferreterías.
        </h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  /* Este margen debe coincidir con el ancho de tu sidebar */
  margin-left: 250px;
  min-height: 100vh;
}

.colorinicio {
  color: #2575fc;
}

/* Un toque extra para que el nombre del sistema resalte */
.aurora-text {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Ajuste para pantallas pequeñas si decides ocultar el menú luego */
@media (max-width: 768px) {
  .home-container {
    margin-left: 0;
  }
}
</style>
