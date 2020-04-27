import env from './environment'

const DEFAULT_CHAIN_ID = 'CHAIN_ID'

// Get a setting from localStorage
function getLocalStorageSetting(confKey) {
  const storageKey = `${confKey}_KEY`
  return window.localStorage.getItem(storageKey)
}

// Get a local setting: from the local storage if available, or the env vars.
function getLocalSetting(confKey) {
  return getLocalStorageSetting(confKey) || env(confKey)
}

function setLocalSetting(confKey, value) {
  const storageKey = `${confKey}_KEY`
  return window.localStorage.setItem(storageKey, value)
}

export function getDefaultChain() {
  return Number(getLocalSetting(DEFAULT_CHAIN_ID)) || ''
}

export function setDefaultChain(chainId) {
  return setLocalSetting(DEFAULT_CHAIN_ID, chainId)
}
