import { getNetworkType } from '../lib/web3-utils'

export const ETHER_TOKEN_FAKE_ADDRESS =
  '0x0000000000000000000000000000000000000000'

const DAI_RINKEBY_TOKEN_ADDRESS = '0x0527E400502d0CB4f214dd0D2F2a323fc88Ff924'
const DAI_MAINNET_TOKEN_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

const DAI_TOKEN = {
  symbol: 'DAI',
  name: 'Dai Stablecoin',
  address: getDaiTokenAddress(),
}
const ETHER_TOKEN = {
  symbol: 'ETH',
  name: 'Ether',
  address: ETHER_TOKEN_FAKE_ADDRESS,
}

export function getDefaultTokens() {
  return [ETHER_TOKEN, DAI_TOKEN]
}

export function getDefaultToken() {
  return DAI_TOKEN
}

export function getDaiTokenAddress() {
  if (getNetworkType() === 'mainnet') {
    return DAI_MAINNET_TOKEN_ADDRESS
  }

  if (getNetworkType() === 'rinkeby') {
    return DAI_RINKEBY_TOKEN_ADDRESS
  }
  return ''
}
