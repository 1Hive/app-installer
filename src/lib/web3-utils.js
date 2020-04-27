import env from '../environment'
import { keccak256, RLP } from 'ethers/utils'
import { getDefaultChain } from '../local-settings'

export const ARAGON_DOMAIN = 'aragonid.eth'
export const DEFAULT_LOCAL_CHAIN = ''

export function getUseWalletProviders() {
  const providers = [{ id: 'injected' }, { id: 'frame' }]

  if (env('FORTMATIC_API_KEY')) {
    providers.push({
      id: 'fortmatic',
      useWalletConf: { apiKey: env('FORTMATIC_API_KEY') },
    })
  }

  if (env('PORTIS_DAPP_ID')) {
    providers.push({
      id: 'portis',
      useWalletConf: { dAppId: env('PORTIS_DAPP_ID') },
    })
  }

  return providers
}

export function getUseWalletConnectors() {
  return getUseWalletProviders().reduce((connectors, provider) => {
    if (provider.useWalletConf) {
      connectors[provider.id] = provider.useWalletConf
    }
    return connectors
  }, {})
}

export function getNetworkType(chainId = getDefaultChain()) {
  chainId = String(chainId)

  if (chainId === '1') return 'mainnet'
  if (chainId === '3') return 'ropsten'
  if (chainId === '4') return 'rinkeby'

  return DEFAULT_LOCAL_CHAIN
}

export function getNetworkName(chainId = getDefaultChain()) {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '3') return 'Ropsten'
  if (chainId === '4') return 'Rinkeby'

  return 'unknown'
}

export function isLocalOrUnknownNetwork(chainId = getDefaultChain()) {
  return getNetworkType(chainId) === DEFAULT_LOCAL_CHAIN
}

export async function resolveEnsDomain(domain, provider) {
  try {
    return provider.resolveName(domain)
  } catch (err) {
    if (err.message === 'ENS name not defined.') {
      return ''
    }
    throw err
  }
}

export async function resolveDaoAddressOrEnsDomain(dao, provider) {
  return resolveEnsDomain(convertDAOIdToSubdomain(dao), provider)
}

export function isValidAragonId(aragonId) {
  return /^[a-z0-9-]+$/.test(aragonId)
}

export function convertDAOIdToSubdomain(aragonId) {
  // If already a subdomain, return
  if (new RegExp(`^([a-z0-9-]+).${ARAGON_DOMAIN}$`).test(aragonId))
    return aragonId

  if (!isValidAragonId(aragonId)) throw new Error(`Invalid DAO Id: ${aragonId}`)

  return `${aragonId}.${ARAGON_DOMAIN}`
}

export async function buildNonceForAddress(address, index, provider) {
  const txCount = await provider.getTransactionCount(address)
  return `0x${(txCount + index).toString(16)}`
}

/**
 * Calculates the next created address by the kernel
 * @dev see https://ethereum.stackexchange.com/questions/760/how-is-the-address-of-an-ethereum-contract-computed/761#761
 * @param {*} daoAddress address of the kernel
 * @param {*} nonce address nonce
 * @returns {string} conterfactual address
 */
export async function calculateNewProxyAddress(daoAddress, nonce) {
  const rlpEncoded = RLP.encode([daoAddress, nonce])
  const contractAddressLong = keccak256(rlpEncoded)
  const contractAddress = `0x${contractAddressLong.substr(-40)}`

  return contractAddress
}
