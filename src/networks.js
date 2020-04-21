import { getNetworkType, isLocalOrUnknownNetwork } from './lib/web3-utils'

export const networks = {
  mainnet: {
    ensRegistry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  },
  rinkeby: {
    ensRegistry: '0x98df287b6c145399aaa709692c8d308357bc085d',
  },
  local: {
    ensRegistry: '0x5f6f7e8cc7346a11ca2def8f827b7a0b612c56a1',
  },
}

function getNetworkInternalName() {
  return isLocalOrUnknownNetwork() ? 'local' : getNetworkType()
}

export function getNetwork() {
  return networks[getNetworkInternalName()]
}
