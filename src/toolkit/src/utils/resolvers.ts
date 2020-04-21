import { isAddress } from 'web3-utils'
import { useEnvironment } from '../helpers/useEnvironment'
import { convertDAOIdToSubdomain } from './aragonId'
import { ethers } from 'ethers'
// Note: Must use require because 'ethereum-ens' is an untyped library
// without type definitions or @types/ethereum-ens
/* eslint-disable @typescript-eslint/no-var-requires */
const ENS = require('ethjs-ens')

/**
 * Resolve an ens domain
 *
 * @param domain ENS domain
 * @param environment Environment
 * @returns Resolved ens domain
 */
export async function resolveEnsDomain(
  domain: string,
  environment: string,
  provider?: ethers.providers.Provider
): Promise<string> {
  try {
    const { apmOptions } = useEnvironment(environment)

    const ens = new ENS({ provider, registryAddress: apmOptions.ensRegistryAddress })

    return ens.resolver(domain).addr()
  } catch (err) {
    if (err.message === 'ENS name not defined.') {
      return ''
    }
    throw err
  }
}

/**
 * Return a DAO address from its subdomain
 *
 * @param dao DAO address or ENS domain
 * @param environment Envrionment
 * @return aclAddress
 */
export async function resolveDaoAddressOrEnsDomain(
  dao: string,
  environment: string
): Promise<string> {
  return isAddress(dao)
    ? dao
    : resolveEnsDomain(convertDAOIdToSubdomain(dao), environment)
}
