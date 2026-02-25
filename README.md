# @openape/nuxt-grants

Nuxt module that adds **grant management** and **agent authentication** to an OpenApe Identity Provider. Provides API routes for the full grant lifecycle (request, approve, deny, revoke) and agent enrollment via challenge-response.

> **Important:** This module is an add-on for `@openape/nuxt-auth-idp` and must be loaded **after** it in your Nuxt config.

## Installation

```bash
npm install @openape/nuxt-grants
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@openape/nuxt-auth-idp',   // ← must come first
    '@openape/nuxt-grants',
  ],

  openapeIdp: {
    // ... IdP configuration
  },

  openapeGrants: {
    enablePages: true,
  },
})
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enablePages` | `boolean` | `true` | Auto-generate grant management pages |

## Grant API Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/grants` | List all grants |
| `POST` | `/api/grants` | Create a grant request |
| `POST` | `/api/grants/verify` | Verify an authorization JWT |
| `GET` | `/api/grants/:id` | Get grant details |
| `POST` | `/api/grants/:id/approve` | Approve a pending grant |
| `POST` | `/api/grants/:id/deny` | Deny a pending grant |
| `POST` | `/api/grants/:id/revoke` | Revoke an approved grant |
| `POST` | `/api/grants/:id/token` | Issue an authorization JWT for an approved grant |

### Create Grant — `POST /api/grants`

```json
{
  "requester": "agent@example.com",
  "target": "api.github.com",
  "grant_type": "once",
  "permissions": ["write:issues"],
  "reason": "Create issue for bug report"
}
```

## Agent API Routes

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/agent/challenge` | Get a challenge for agent authentication |
| `POST` | `/api/agent/authenticate` | Verify agent authentication (challenge-response) |
| `POST` | `/api/agent/enroll` | Enroll a new agent with a key pair |

CORS is enabled for `/api/grants/**` and `/api/agent/**` to allow cross-origin agent requests.

## Pages

When `enablePages` is `true`, the module auto-generates the following pages (overridable by placing your own in `pages/`):

| Path | Description |
|------|-------------|
| `/grant-approval` | Approve or deny pending grant requests |
| `/grants` | List and manage all grants |
| `/enroll` | Agent enrollment page |

See the [examples](../examples) directory for a fully working IdP + Grants setup.

## License

[MIT](./LICENSE)
