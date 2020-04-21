import { resolveDaoAddressOrEnsDomain } from '../../utils/resolvers'
import { useEnvironment } from '../../helpers/useEnvironment'
import { ethers } from 'ethers'
// Note: Must use require because '@aragon/wrapper' is an untyped library
// without type definitions or @types/@aragon/wrapper
/* eslint-disable @typescript-eslint/no-var-requires */
const AragonWrapper = require('@aragon/wrapper').default
let wrapper: any = null


/**
 * Initialize the Aragon.js wrapper and subscribe to the `apps`,
 * `forwarders`, `transactions` and `permissions` observables.
 *
 * @param dao DAO address
 * @param environment Environment
 * @param options Options
 * @returns  Aragon wrapper with an added `cancel` function
 */
export async function initWrapper(
  dao: string,
  environment: string,
  provider?: ethers.providers.Web3Provider,
  options?: {
    accounts?: string[]
    onApps?: (apps: any) => void
    onForwarders?: (forwarders: any) => void
    onTransaction?: (transaction: any) => void
    onDaoAddress?: (daoAddress: string) => void
    onPermissions?: (permissions: any) => void
  },
  ): Promise<any> {
    
    const { apmOptions, gasPrice } = useEnvironment(environment)
    const daoAddress = await resolveDaoAddressOrEnsDomain(dao, environment)

  if (!daoAddress) {
    throw new Error('The provided DAO address is invalid')
  }

  if (options) {
    const { onDaoAddress } = options
    if (onDaoAddress) onDaoAddress(daoAddress)
  }

  if (!wrapper) {
    wrapper = new AragonWrapper(daoAddress, {
      provider: provider?._web3Provider,
      defaultGasPriceFn: (): string => gasPrice,
      apm: apmOptions,
    })

    const accounts = (options && options.accounts) || []
  
    try {
      await wrapper.init({ accounts: { providedAccounts: accounts } })
    } catch (err) {
      if (err.message === 'connection not open') {
        throw new Error('The wrapper cannot be initialized without a connection')
      }
      throw err
    }
  
    const subs: { unsubscribe: () => void }[] = []
    if (options) {
      const { onApps, onForwarders, onTransaction, onPermissions } = options
      if (onApps) subs.push(wrapper.apps.subscribe(onApps))
      if (onForwarders) subs.push(wrapper.forwarders.subscribe(onForwarders))
      if (onTransaction) subs.push(wrapper.transactions.subscribe(onTransaction))
      if (onPermissions) subs.push(wrapper.permissions.subscribe(onPermissions))
    }
  
    wrapper.cancel = (): void => {
      for (const subscription of subs)
        if (subscription) subscription.unsubscribe()
    }
  }

  return wrapper
}
