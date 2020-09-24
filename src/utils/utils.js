import BN from 'bn.js'
import { getNetwork } from '../networks'

export const SECONDS_IN_A_MONTH = 2628000
const PCT_BASE = new BN('1000000000000000000')

export function buildDaoUrl(daoDomain) {
  const network = getNetwork()

  const url =
    network.clientUrl ||
    `https://${
      network.type === 'main' ? '' : network.type
    }.client.aragon.org/#/`

  return `${url}${daoDomain}`
}

export function monthsToSeconds(months) {
  return Math.round(months * SECONDS_IN_A_MONTH)
}

export function secondsToMonths(seconds) {
  return Math.round(seconds / SECONDS_IN_A_MONTH)
}

export function multiplierToBase(multiplier) {
  return new BN(multiplier * 100).mul(PCT_BASE.div(new BN(100)))
}

export function multiplierFromBase(multiplier) {
  return parseInt(multiplier.div(PCT_BASE.div(new BN(100)))) / 100
}
