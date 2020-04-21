import ethers from 'ethers'
import { takeWhile } from 'rxjs/operators'
import { useEnvironment } from '../../helpers/useEnvironment'
import { initWrapper } from '../utils/wrapper'
import { kernelAbi } from '../../contractAbis'

type AragonApp = any

/**
 * Return installed apps for a DAO
 *
 * @param dao DAO address
 * @param environment Envrionment
 * @returns Installed apps
 */
export async function getInstalledApps(
  dao: string,
  environment: string,
  provider: ethers.providers.Web3Provider
): Promise<AragonApp[]> {
  const wrapper = await initWrapper(dao, environment, provider)
  return (
    wrapper.apps
      // If the app list contains a single app, wait for more
      .pipe(takeWhile((apps: AragonApp[]) => apps.length <= 1, true))
      .toPromise()
  )
}