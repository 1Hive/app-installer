import {
  encodeActCall,
  execAppMethods,
  getCounterfactualAppAddress,
  getTransactionPath,
} from './toolkit'
import { parseInitParams, parsePermissionIntents } from './utils'
import { getNetworkType } from './lib/web3-utils'

const newAppInstanceSignature = 'newAppInstance(bytes32,address,bytes,bool)'

async function getInitPayload(daoApps, functions, appInitParams, settings) {
  console.log('settings', settings)
  const appInitArgs = parseInitParams(daoApps, appInitParams, settings)

  console.log('appInitArgs', appInitArgs)

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
  let scriptExecutor
  console.log(
    'calling install with',
    daoAddress,
    daoApps,
    selectedApps,
    appsSettings
  )

  try {
    for (const {
      id,
      appId,
      appInitParams,
      contractAddress,
      functions,
      permissions,
      roles,
    } of selectedApps) {
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

      scriptExecutor =
        path.length === 1 ? path[0].from : path[path.length - 2].to

      // Get conterfatual proxy address for app
      const proxyAddress = await getCounterfactualAppAddress(
        daoAddress,
        appId,
        contractAddress,
        initPayload,
        scriptExecutor,
        getNetworkType(),
        provider
      )

      const permissionIntents = parsePermissionIntents(
        daoApps,
        permissions,
        roles,
        proxyAddress
      )

      const intentBasket = [installAppIntent, ...permissionIntents]

      const { transaction } = await execAppMethods(
        daoAddress,
        intentBasket,
        getNetworkType(),
        provider
      )

      const { to, data } = transaction

      return { to, data }
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}
