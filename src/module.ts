import { defineNuxtModule, createResolver, addServerHandler, addServerImportsDir, extendPages, hasNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  enablePages: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@openape/nuxt-grants',
    configKey: 'openapeGrants',
  },
  defaults: {
    enablePages: true,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Peer-dependency check: nuxt-auth-idp must be loaded
    if (!hasNuxtModule('@openape/nuxt-auth-idp')) {
      throw new Error('@openape/nuxt-grants requires @openape/nuxt-auth-idp — add it to your modules before nuxt-grants')
    }

    // CORS rules for grant/agent endpoints
    nuxt.options.routeRules = defu(nuxt.options.routeRules || {}, {
      '/api/grants/**': { cors: true },
      '/api/agent/**': { cors: true },
    })

    // Register server utils (auto-imported by Nitro)
    addServerImportsDir(resolve('./runtime/server/utils'))

    // Pages (overridable by app)
    if (options.enablePages) {
      extendPages((pages) => {
        const pageConfigs = [
          { name: 'openape-grant-approval', path: '/grant-approval', file: 'grant-approval.vue' },
          { name: 'openape-grants', path: '/grants', file: 'grants.vue' },
          { name: 'openape-enroll', path: '/enroll', file: 'enroll.vue' },
        ]

        for (const config of pageConfigs) {
          const exists = pages.some(p => p.path === config.path)
          if (!exists) {
            pages.push({
              name: config.name,
              path: config.path,
              file: resolve(`./runtime/pages/${config.file}`),
            })
          }
        }
      })
    }

    // Grant API routes
    addServerHandler({ route: '/api/grants', handler: resolve('./runtime/server/api/grants/index.get') })
    addServerHandler({ route: '/api/grants', method: 'post', handler: resolve('./runtime/server/api/grants/index.post') })
    addServerHandler({ route: '/api/grants/verify', method: 'post', handler: resolve('./runtime/server/api/grants/verify.post') })
    addServerHandler({ route: '/api/grants/:id', handler: resolve('./runtime/server/api/grants/[id].get') })
    addServerHandler({ route: '/api/grants/:id/approve', method: 'post', handler: resolve('./runtime/server/api/grants/[id]/approve.post') })
    addServerHandler({ route: '/api/grants/:id/deny', method: 'post', handler: resolve('./runtime/server/api/grants/[id]/deny.post') })
    addServerHandler({ route: '/api/grants/:id/revoke', method: 'post', handler: resolve('./runtime/server/api/grants/[id]/revoke.post') })
    addServerHandler({ route: '/api/grants/:id/token', method: 'post', handler: resolve('./runtime/server/api/grants/[id]/token.post') })

    // Agent API routes
    addServerHandler({ route: '/api/agent/challenge', method: 'post', handler: resolve('./runtime/server/api/agent/challenge.post') })
    addServerHandler({ route: '/api/agent/authenticate', method: 'post', handler: resolve('./runtime/server/api/agent/authenticate.post') })
    addServerHandler({ route: '/api/agent/enroll', method: 'post', handler: resolve('./runtime/server/api/agent/enroll.post') })
  },
})
