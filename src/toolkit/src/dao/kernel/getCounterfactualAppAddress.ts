import { initWrapper } from '../utils/wrapper'
import { ethers } from 'ethers'

/**
 * Return counterfactual proxy address of a future installed app
 *
 * @param dao DAO address
 * @param appId App id that would be installed
 * @param contractAddress Base address of the app
 * @param encodedInitializeFunc Encoded bytes of the initialize function
 * @param from Address that would execute the function
 * @param environment Envrionment
 * @returns Counterfactual app address
 */
export async function getCounterfactualAppAddress(
  dao: string,
  appId: string,
  contractAddress: string,
  encodedInitializeFunc: string,
  from: string,
  environment: string,
  provider: ethers.providers.Web3Provider
): Promise<String> {
  const wrapper = await initWrapper(dao, environment, provider)

  return await wrapper.kernelProxy.call(
    'newAppInstance',
    appId,
    contractAddress,
    encodedInitializeFunc,
    false,
    { from }
  )
 
}
