import type { OpenApeGrant } from '@openape/core'

export default defineEventHandler(async (event) => {
  const { grantStore } = useGrantStores()
  const { agentStore } = useIdpStores()
  const query = getQuery(event)

  if (query.requester) {
    return await grantStore.findByRequester(String(query.requester))
  }

  const session = await getAppSession(event)
  if (!session.data.userId) {
    return await grantStore.findPending()
  }

  const email = session.data.userId as string

  if (isAdmin(email)) {
    return await grantStore.findAll()
  }

  const ownedAgents = await agentStore.findByOwner(email)
  const approvedAgents = await agentStore.findByApprover(email)
  const agentIds = new Set([
    ...ownedAgents.map(a => a.id),
    ...approvedAgents.map(a => a.id),
  ])

  const allGrants = await grantStore.findAll()
  return allGrants.filter((grant: OpenApeGrant) => {
    if (grant.request.target === email)
      return true
    if (grant.request.requester === email)
      return true
    if (grant.request.requester.startsWith('agent:')) {
      const agentId = grant.request.requester.slice(6)
      if (agentIds.has(agentId))
        return true
    }
    if (grant.status === 'pending')
      return true
    return false
  })
})
