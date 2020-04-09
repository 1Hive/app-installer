/* eslint @typescript-eslint/no-var-requires: "off" */

//
import { AragonAppJson, AragonEnvironments, AragonManifest } from '../types'
import arapp from '../config/arapp.json'
// import truffleConfig from '../config/truffle.js'

const OLD_ENS_REGISTRY = '0x314159265dd8dbb310642f98f50c066173c1259b'
const NEW_ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'


/**
 * Check mainnet ENS registry on arapp.json and switch to new address
 * @param {Object} environments environments
 * @return {Object} Mutated environments
 */
function checkMainnetEnsMigration(
  environments: AragonEnvironments
): AragonEnvironments {
  const { mainnet } = environments
  if (mainnet && mainnet.registry && mainnet.registry === OLD_ENS_REGISTRY) {
    environments.mainnet.registry = NEW_ENS_REGISTRY
    console.log(
      `\n
      The ENS registry on mainnet migrate to ${NEW_ENS_REGISTRY}
      You still have the old registry configure on arapp.json.
      Update your mainnet environmnet with the new registry address.
      `
    )
  }
  return environments
}

/**
 * Loads the arapp.json file. If it's non existent, it returns null
 * @return {Object|undefined}
 */
export function loadArappFile(): AragonAppJson | undefined {

  return {
    ...arapp,
    environments: checkMainnetEnsMigration(arapp.environments),
  }
}

// /**
//  * Loads the truffle config file. If it's non existent, it returns null
//  * @return {Object|undefined}
//  */
// export function getTruffleConfig(): any {

//   return truffleConfig

//   throw new Error(`Didn't find any truffle.js file`)
// }
