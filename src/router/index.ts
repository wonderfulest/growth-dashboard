import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Contact Us
    {
      path: '/contact-us',
      name: 'ContactUs',
      component: () => import('@/views/contact/ContactUs.vue'),
      meta: { requiresAuth: true }
    },
    // Marketing Email module (moved under /marketing)
    {
      path: '/marketing/email-templates',
      name: 'EmailTemplates',
      component: () => import('@/views/marketing/EmailTemplates.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/marketing/email-templates/:id/edit',
      name: 'EmailTemplateEdit',
      component: () => import('@/views/marketing/EmailTemplateEdit.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/email-records',
      name: 'EmailRecords',
      component: () => import('@/views/dashboard/EmailRecords.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/user-management',
      name: 'UserManagement',
      component: () => import('@/views/UserManagement.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/user-management/change-email',
      name: 'ChangeUserEmail',
      component: () => import('@/views/ChangeUserEmail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/email-preferences',
      name: 'EmailPreferences',
      component: () => import('@/views/EmailPreferences.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/role-management',
      name: 'RoleManagement',
      component: () => import('@/views/RoleManagement.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/images',
      redirect: '/design/images'
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/user-management',
      redirect: '/users/user-management'
    },
    {
      path: '/user-management/change-email',
      redirect: '/users/user-management/change-email'
    },
    {
      path: '/role-management',
      redirect: '/users/role-management'
    },
    {
      path: '/dict',
      redirect: '/users/dict'
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('@/views/AuthCallback.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
   
  ]
})

// 路由守卫
router.beforeEach((to, _, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const ssoBaseUrl = import.meta.env.VITE_SSO_LOGIN_URL
  const redirectUri = import.meta.env.VITE_SSO_REDIRECT_URI
  const ssoLoginUrl = `${ssoBaseUrl}?client=dashboard&redirect_uri=${encodeURIComponent(redirectUri)}`

  console.log('beforeEach userInfo', userStore.userInfo)
  if (requiresAuth && !userStore.userInfo) {
    window.location.href = ssoLoginUrl
    return
  } else {
    next()
  }
})

export default router
