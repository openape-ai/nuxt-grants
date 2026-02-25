import { createGrantStore } from './grant-store'
import { createGrantChallengeStore } from './challenge-store'

let _stores: ReturnType<typeof initStores> | null = null

function initStores() {
  return {
    grantStore: createGrantStore(),
    challengeStore: createGrantChallengeStore(),
  }
}

function getStores() {
  if (!_stores) {
    _stores = initStores()
  }
  return _stores
}

export const useGrantStores = getStores
