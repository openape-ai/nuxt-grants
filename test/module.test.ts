import { describe, expect, it } from 'vitest'
import module from '../src/module'

describe('nuxt-grants module', () => {
  it('exposes expected metadata', async () => {
    const meta = await module.getMeta()
    expect(meta.name).toBe('@openape/nuxt-grants')
    expect(meta.configKey).toBe('openapeGrants')
  })
})
