<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import type { CustomerInterface } from '../interfaces/Customer'
import { registerCustomer } from '../services/service-customer'
import router from '../router'
import { getIdTypes } from '../services/service-id-type'
import type { IdType } from '../services/service-id-type'

const today = ref(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }))

const form: CustomerInterface = reactive({
  identificationType: {
    id: '',
  },
  identificationNumber: '',
  fullName: '',
  phoneNumber: '',
  birthDate: '',
})

const formRef = ref<HTMLFormElement | null>(null)
const successMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const identificationTypeOptions = ref<IdType[]>([])

const isLoadError = ref(false)

onMounted(async () => {
  isLoading.value = true

  const response = await getIdTypes()
  if (response.success) {
    identificationTypeOptions.value = (response.success as any).data
  } else {
    errorMessage.value =
      'Error al cargar los tipos de documento. Por favor, compruebe la conexión con el servidor.'

    isLoadError.value = true
  }

  if (!isLoadError.value) {
    isLoading.value = false
  }
})

function calculateAgeInYears(birthDateStr: string | undefined): number {
  if (typeof birthDateStr === 'string' && birthDateStr.length >= 10) {
    const yearStr = birthDateStr.substring(0, 4)
    const monthStr = birthDateStr.substring(5, 7)
    const dayStr = birthDateStr.substring(8, 10)

    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) - 1
    const day = parseInt(dayStr, 10)

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return 0
    }

    const fechaNacimiento = new Date(year, month, day)

    if (
      fechaNacimiento.getFullYear() !== year ||
      fechaNacimiento.getMonth() !== month ||
      fechaNacimiento.getDate() !== day
    ) {
      return 0
    }

    const hoy = new Date()

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()

    const diferenciaMes = hoy.getMonth() - fechaNacimiento.getMonth()
    const diferenciaDia = hoy.getDate() - fechaNacimiento.getDate()

    if (diferenciaMes < 0 || (diferenciaMes === 0 && diferenciaDia < 0)) {
      edad--
    }

    return edad
  } else {
    return 0
  }
}

function validateAgeAndDocument(): string | null {
  const selectedId = form.identificationType.id
  const birthDateStr = form.birthDate

  if (!birthDateStr || !selectedId) {
    return null
  }
  const selectedType = identificationTypeOptions.value.find((t) => t.id === selectedId)

  const docName = selectedType ? selectedType.name : ''

  const edadActual = calculateAgeInYears(birthDateStr)

  if (edadActual < 7) {
    return 'La edad mínima de un cliente debe ser de 7 años.'
  }

  if (docName !== 'Cedula de Ciudadania' && docName !== 'Tarjeta de Identidad') {
    return null
  }

  const esMayorDeEdad = edadActual >= 18

  if (esMayorDeEdad) {
    if (docName === 'Tarjeta de Identidad') {
      return 'Para mayores de 18 años, el tipo de documento debe ser Cédula de Ciudadanía.'
    }
  } else {
    if (docName === 'Cedula de Ciudadania') {
      return 'Para menores de 18 años, el tipo de documento debe ser Tarjeta de Identidad.'
    }
  }

  return null
}

watch(
  [() => form.identificationType.id, () => form.birthDate],
  () => {
    if (form.identificationType.id && form.birthDate) {
      const docInput = formRef.value?.querySelector(
        '#floatingIdentificationType',
      ) as HTMLSelectElement
      const dateInput = formRef.value?.querySelector('#floatingBirthdate') as HTMLInputElement
      if (docInput) validateField(docInput)
      if (dateInput) validateField(dateInput)
    }
  },
  { flush: 'post' },
)

function validateField(input: HTMLInputElement | HTMLSelectElement) {
  const feedback = input.parentElement?.querySelector('.invalid-feedback') as HTMLElement
  let message = ''

  input.setCustomValidity('')

  if (input instanceof HTMLInputElement) {
    if (input.validity.valueMissing) {
      message = 'Este campo es obligatorio.'
    } else if (input.validity.tooShort) {
      message = `Debe tener al menos ${input.minLength} caracteres.`
    } else if (input.validity.tooLong) {
      message = `Debe tener máximo ${input.maxLength} caracteres.`
    } else if (input.validity.patternMismatch) {
      if (input.id === 'floatingIdentification') {
        message = 'El número de identificación solo debe contener solo números (6 a 25 caracteres).'
      } else if (input.id === 'floatingPhoneNumber') {
        message = 'El número de teléfono solo debe contener solo números (8 a 15 caracteres).'
      } else if (input.id === 'floatingFullName') {
        message = 'El nombre completo solo debe contener letras y espacios (3 a 100 caracteres).'
      }
    } else if (input.type === 'date') {
      const selectedDate = new Date(input.value)

      const todayDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }))

      selectedDate.setHours(0, 0, 0, 0)
      todayDate.setHours(0, 0, 0, 0)

      if (selectedDate > todayDate) {
        input.setCustomValidity('La fecha de nacimiento no puede ser en el futuro.')
      }
    }
  } else if (input instanceof HTMLSelectElement) {
    if (input.validity.valueMissing) {
      message = 'Debes seleccionar una opción.'
    }
  }

  if (!message) {
    const ageDocError = validateAgeAndDocument()
    if (
      ageDocError &&
      (input.id === 'floatingBirthdate' || input.id === 'floatingIdentificationType')
    ) {
      message = ageDocError
    }
  }

  input.setCustomValidity(message)

  if (feedback) {
    feedback.textContent = message || (input as HTMLInputElement).validationMessage
  }
}

function validateForm() {
  const inputs = formRef.value?.querySelectorAll('input, select')
  let isFormValid = true
  inputs?.forEach((input) => {
    const formElement = input as HTMLInputElement | HTMLSelectElement

    validateField(formElement)
    if (!formElement.checkValidity()) {
      isFormValid = false
    }
  })
  return isFormValid
}

async function send() {
  successMessage.value = ''

  if (!isLoadError.value) {
    errorMessage.value = ''
  }
  // -------------------------

  formRef.value?.classList.add('was-validated')

  if (!validateForm()) {
    return console.log('error: Formulario inválido')
  }

  isLoading.value = true

  const response = await registerCustomer(form)

  isLoading.value = false

  if (response.success) {
    successMessage.value = 'El cliente se registró correctamente.'

    Object.assign(form, {
      identificationType: { id: '' },
      identificationNumber: '',
      fullName: '',
      phoneNumber: '',
      birthDate: '',
    })
    formRef.value?.classList.remove('was-validated')

    setTimeout(() => {
      successMessage.value = ''
      router.push('/customer')
    }, 2000)
  } else {
    errorMessage.value = response.error || 'Ocurrió un error al registrar el cliente.'
    isLoadError.value = false

    setTimeout(() => {
      if (!isLoadError.value) {
        errorMessage.value = ''
      }
    }, 4000)
    // -------------------------
  }
}
</script>

<template>
  <div class="row d-flex justify-content-center my-5">
    <form ref="formRef" @submit.prevent="send" class="col-4 needs-validate" novalidate>
      <div>
        <h1 class="title mb-5 text-center">Registrar cliente</h1>
      </div>

      <div v-if="errorMessage" class="alert alert-danger text-center" role="alert">
        {{ errorMessage }}
      </div>

      <div v-if="isLoadError" class="text-center mt-3">
        <p>El formulario no puede usarse porque los datos iniciales no cargaron.</p>
        <p>Por favor compruebe la conexión con el servidor</p>
        <router-link to="/customer" class="btn btn-secondary">Volver a Clientes</router-link>
      </div>

      <div v-else>
        <div class="mb-4">
          <select
            class="form-select"
            aria-label="Tipo de identificación"
            required
            v-model="form.identificationType.id"
            id="floatingIdentificationType"
            @change="validateField($event.target as HTMLSelectElement)"
            :disabled="isLoading"
          >
            <option value="" disabled selected>Tipo de identificación</option>
            <option v-for="type in identificationTypeOptions" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
          <div class="invalid-feedback">Selecciona un tipo de identificación.</div>
        </div>

        <div class="form-floating mb-4">
          <input
            v-model.trim="form.identificationNumber"
            type="text"
            class="form-control"
            minlength="6"
            maxlength="25"
            pattern="\d{6,25}"
            required
            id="floatingIdentification"
            placeholder=""
            @input="validateField($event.target as HTMLInputElement)"
            :disabled="isLoading"
          />
          <label for="floatingIdentification">Número de identificación</label>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-floating mb-4">
          <input
            v-model.trim="form.fullName"
            type="text"
            class="form-control"
            minlength="3"
            maxlength="100"
            pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,100}$"
            required
            id="floatingFullName"
            placeholder=""
            @input="validateField($event.target as HTMLInputElement)"
            :disabled="isLoading"
          />
          <label for="floatingFullName">Nombre completo</label>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-floating mb-4">
          <input
            v-model.trim="form.phoneNumber"
            type="text"
            class="form-control"
            minlength="8"
            maxlength="15"
            pattern="\d{8,15}"
            required
            id="floatingPhoneNumber"
            placeholder=""
            @input="validateField($event.target as HTMLInputElement)"
            :disabled="isLoading"
          />
          <label for="floatingPhoneNumber">Número de telefono</label>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-floating mb-4">
          <input
            v-model="form.birthDate"
            type="date"
            class="form-control"
            required
            id="floatingBirthdate"
            min="1900-01-01"
            :max="today"
            @input="validateField($event.target as HTMLInputElement)"
            :disabled="isLoading"
          />
          <label for="floatingBirthdate">Fecha de nacimiento</label>
          <div class="invalid-feedback">Selecciona una fecha válida.</div>
        </div>

        <div class="d-flex justify-content-between mb-3">
          <router-link to="/customer" class="btn btn-danger" :class="{ disabled: isLoading }"
            >Cancelar</router-link
          >
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <span role="status">{{ isLoading ? 'Registrando...' : 'Registrar' }}</span>
          </button>
        </div>

        <transition name="slide-fade">
          <div
            v-if="successMessage"
            class="alert-success-custom mt-3 text-center p-3 fw-semibold rounded"
          >
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ successMessage }}
          </div>
        </transition>
      </div>
    </form>
  </div>
</template>

<style scoped>
.title {
  font-size: 2.3rem;
  font-weight: 600;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
}
.alert-success-custom {
  background-color: #20c997;
  color: #fff;
  letter-spacing: 0.3px;
}
</style>
