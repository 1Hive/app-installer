import { getNetworkType } from '../lib/web3-utils'

export function buildDaoUrl(daoDomain) {
  const network = getNetworkType()
  return `https://${network}.aragon.org/#/${daoDomain}`
}
