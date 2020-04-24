import {
  encodeActCall,
  getTransactionPath,
  getTransactionPathFromIntentBasket,
} from '../toolkit'
import { parseInitParams, parsePermissionIntents } from '../utils'
import {
  getNetworkType,
  calculateNewProxyAddress,
  buildNonceForAddress,
} from '../lib/web3-utils'

const newAppInstanceSignature = 'newAppInstance(bytes32,address,bytes,bool)'

async function getInitPayload(daoApps, functions, appInitParams, settings) {
  const appInitArgs = parseInitParams(daoApps, appInitParams, settings)

  const appInit = functions.find(fn => fn.abi.name === 'initialize')
  return encodeActCall(appInit.sig, appInitArgs)
}

export async function getInstallRawTx(
  daoAddress,
  daoApps,
  selectedApps,
  appsSettings,
  provider
) {
  let intentBasket = []
  try {
    for (const [index, selectedApp] of selectedApps.entries()) {
      const {
        id,
        appId,
        appInitParams,
        contractAddress,
        functions,
        permissions,
        roles,
      } = selectedApp

      const appSettings = appsSettings[id]
      // Build install App intent
      const initPayload = await getInitPayload(
        daoApps,
        functions,
        appInitParams,
        appSettings
      )

      const installParams = [appId, contractAddress, initPayload, false]
      const installAppIntent = [
        daoAddress,
        newAppInstanceSignature,
        installParams,
      ]

      // Look for a transaction path for the connected account
      const path = await getTransactionPath(
        daoAddress,
        ...installAppIntent,
        getNetworkType(),
        provider
      )

      if (!path.length) {
        throw new Error('Could not find tx path for given address')
      }

      // const scriptExecutor =
      //   path.length === 1 ? path[0].from : path[path.length - 2].to

      // Get conterfatual proxy address for app
      const nonce = await buildNonceForAddress(daoAddress, index, provider)
      const proxyAddress = await calculateNewProxyAddress(daoAddress, nonce)

      const permissionIntents = parsePermissionIntents(
        daoApps,
        permissions,
        roles,
        proxyAddress
      )

      const appInstallIntentBasket = [installAppIntent, ...permissionIntents]

      intentBasket = [...intentBasket, ...appInstallIntentBasket]
    }

    // Get transaction path for install and permission intents
    const { transaction } = await getTransactionPathFromIntentBasket(
      daoAddress,
      intentBasket,
      getNetworkType(),
      provider
    )

    const { to, data } = transaction

    return { to, data }
  } catch (err) {
    console.error(err)
    throw err
  }
}
