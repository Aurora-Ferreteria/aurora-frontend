import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, useAuth0 } from '@auth0/auth0-vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('../views/UnauthorizedView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/perfil',
      name: 'perfil',
      // Asegúrate de que la ruta coincida con la ubicación de tu componente
      component: () => import('../components/auth0/UserProfile.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/customer',
      name: 'customer',
      component: () => import('../views/CustomerView.vue'),
      beforeEnter: authGuard,
      meta: { roles: ['ADMIN', 'VENDEDOR'] },
    },
    {
      path: '/customer/register',
      name: 'customer-register',
      component: () => import('../views/CustomerRegister.vue'),
      beforeEnter: authGuard,
      meta: { roles: ['ADMIN', 'VENDEDOR'] },
    },
  ],
})

// GUARDIA DE SEGURIDAD GLOBAL
router.beforeEach(async (to, from, next) => {
  const auth0 = useAuth0()

  // 1. Lógica de registro de clientes primero
  if (to.name === 'customer-register' && from.name !== 'customer') {
    alert('Para registrar un cliente, primero debes consultar la lista de clientes.')
    return next({ name: 'customer' })
  }

  // 2. Si no requiere roles, lo dejamos pasar
  if (!to.meta.roles) return next()

  // 3. Esperar a que Auth0 cargue
  while (auth0.isLoading.value) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // 4. Verificación de roles
  const user = auth0.user.value
  const userRoles = user?.['https://aurora.com/roles'] || []
  const hasAccess = (to.meta.roles as string[]).some((role) => userRoles.includes(role))

  if (hasAccess) {
    return next()
  } else {
    return next({ name: 'unauthorized' })
  }
})

export default router
