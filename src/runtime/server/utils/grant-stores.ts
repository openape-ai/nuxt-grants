import { createGrantStore } from './grant-store'
import { createChallengeStore } from './challenge-store'

let _stores: ReturnType<typeof initStores> | null = null

function initStores() {
  return {
    grantStore: createGrantStore(),
    challengeStore: createChallengeStore(),
  }
}

function getStores() {
  if (!_stores) {
    _stores = initStores()
  }
  return _stores
}

export const useGrantStores = getStores
