<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCustomers } from '../services/service-customer'
import type { Customer } from '../interfaces/Customer'

const customers = ref<Customer[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

// 1. AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA
const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  // Restar un año si el mes actual es menor al mes de nacimiento,
  // o si es el mismo mes pero el día actual es menor al día de nacimiento
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = null

  try {
    const response = await getCustomers()

    if (response.success) {
      customers.value = response.success.data || []
    } else {
      errorMessage.value = response.error || 'No se pudieron cargar los clientes.'
    }
  } catch (error) {
    errorMessage.value = 'Error al conectar con el servidor.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="customer-container p-5">
    <div class="header-section mb-5">
      <h1 class="color-cliente display-2 fw-bold">Clientes</h1>
      <div class="d-flex gap-2 mt-3">
        <router-link to="/customer/register" class="btn btn-primary fw-bold px-4">
          <i class="bi bi-person-plus-fill me-2"></i>Registrar nuevo cliente
        </router-link>
        <button type="button" class="btn btn-outline-primary fw-bold px-4">
          <i class="bi bi-filter me-2"></i>Filtrar
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="fs-4 mt-2">Cargando clientes...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger shadow-sm">
      {{ errorMessage }}
    </div>

    <div v-else-if="customers.length === 0" class="alert alert-info shadow-sm">
      No hay clientes registrados por el momento.
    </div>

    <div v-else class="card shadow-sm border-0">
      <!-- 2. CORREGIDO EL ERROR DE TIPEO AQUÍ (decía 'iv' en lugar de '<div') -->
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Tipo Identificación</th>
              <th>N° Identificación</th>
              <th>Nombre Completo</th>
              <th>Teléfono</th>
              <th>Fecha Nacimiento</th>
              <th>Edad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id">
              <td>
                <span class="badge bg-secondary-subtle text-secondary-emphasis">
                  <!-- Usamos ?. por si identificationType viene nulo -->
                  {{ customer.identificationType?.name }}
                </span>
              </td>
              <td class="fw-bold">{{ customer.identificationNumber }}</td>
              <td style="white-space: pre-wrap">{{ customer.fullName }}</td>
              <td>{{ customer.phoneNumber }}</td>
              <td>{{ customer.birthDate }}</td>
              <td>
                <!-- Ahora esto funcionará porque calculateAge ya existe en el script -->
                <span class="fw-bold text-primary"
                  >{{ calculateAge(customer.birthDate) }} años</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-container {
  margin-left: 250px;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.color-cliente {
  color: #2575fc;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  padding: 1rem;
}

.table tbody td {
  padding: 1rem;
}

@media (max-width: 768px) {
  .customer-container {
    margin-left: 0;
  }
}
</style>
