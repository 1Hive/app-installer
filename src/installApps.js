import {
  encodeActCall,
  execAppMethods,
  getCounterfactualAppAddress,
  getTransactionPath,
} from './toolkit'
import { parseInitParams, parsePermissionIntents } from './utils'

const newAppInstanceSignature = 'newAppInstance(bytes32,address,bytes,bool)'

export async function installApps(daoAddress, daoApps, selectedApps) {
  let scriptExecutor
  console.log('calling install with', daoAddress, daoApps, selectedApps)

  try {
    for (const {
      appId,
      appInitParams,
      contractAddress,
      functions,
      permissions,
      roles,
    } of selectedApps) {
      const appInit = functions.find(fn => fn.abi.name === 'initialize')

      const appInitArgs = parseInitParams(daoApps, appInitParams)

      console.log('appInitArgs', appInitArgs)

      const initPayload = await encodeActCall(appInit.sig, [
        ...appInitArgs,
        ['0x0000000000000000000000000000000000000000'],
      ])

      const installParams = [appId, contractAddress, initPayload, false]
      const installAppIntent = [
        daoAddress,
        newAppInstanceSignature,
        installParams,
      ]

      const path = await getTransactionPath(daoAddress, ...installAppIntent)

      scriptExecutor =
        path.length === 1 ? path[0].from : path[path.length - 2].to

      console.log('scriptExectur', scriptExecutor)

      const proxyAddress = await getCounterfactualAppAddress(
        daoAddress,
        appId,
        contractAddress,
        initPayload,
        scriptExecutor
      )

      const permissionIntents = parsePermissionIntents(
        daoApps,
        permissions,
        roles,
        proxyAddress
      )

      const intentBasket = [installAppIntent, ...permissionIntents]
      console.log('intentBasket', intentBasket)

      await execAppMethods(daoAddress, intentBasket)
    }
  } catch (err) {
    console.error(err)
  }
}

// calldatum.push(
//   await encodeActCall(newAppInstanceSignature, [
//     appId,
//     contractAddress,
//     initPayload,
//     false,
//   ])
// )
