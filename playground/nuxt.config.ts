export default defineNuxtConfig({
  modules: ['@openape/nuxt-auth-idp', '../src/module'],
  compatibilityDate: '2025-01-01',
  openapeIdp: {
    sessionSecret: 'playground-secret-at-least-32-characters-long',
    rpName: 'Playground',
    rpID: 'localhost',
    rpOrigin: 'http://localhost:3000',
  },
  openapeGrants: {
    enablePages: true,
  },
})
