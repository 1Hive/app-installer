const url =  require('url')

import { defaultEnvironments } from '../config'
import { loadArappFile } from './loadConfigFiles'
import {
  DEFAULT_GAS_PRICE,
  IPFS_RPC,
  IPFS_LOCAL_GATEWAY,
  IPFS_ARAGON_GATEWAY,
  DEVCHAIN_ENS,
} from './constants'
import { AragonAppJson, AragonEnvironment } from '../types'
import { Web3Provider } from 'ethers/providers'

export class NoEnvironmentInArapp extends Error {}
export class NoEnvironmentInDefaults extends Error {}
export class NoNetworkInTruffleConfig extends Error {}

function getEnvironment(
  envName: string,
  arapp?: AragonAppJson
): AragonEnvironment {
  if (arapp) {
    if (!envName) envName = 'default'
    const environment = arapp.environments[envName]
    if (!environment) throw new NoEnvironmentInArapp(envName)
    return environment
  } else {
    // if there is no arapp.json and the command is not init default to the "global" config
    // designed for the dao commands including dao acl
    if (!envName) envName = 'local'
    const environment = defaultEnvironments[envName]
    if (!environment) throw new NoEnvironmentInDefaults(envName)
    return environment
  }
}

interface ApmOptions {
  ensRegistryAddress: string
  ipfs: {
    rpc: {
      protocol: string
      host: string
      port: number
      default?: boolean
    }
    gateway: string
  }
}

function configureApm(
  ipfsRpcUrl: string,
  gatewayUrl: string,
  ensRegistryAddress: string
): ApmOptions {
  if (ipfsRpcUrl) {

    const uri = url.parse(ipfsRpcUrl)

    return {
      ensRegistryAddress,
      ipfs: {
        rpc: {
          protocol: uri.protocol.replace(':', ''),
          host: uri.hostname,
          port: parseInt(uri.port),
          default: uri.hash === '#default',
        },
        gateway: gatewayUrl,
      },
    }
  } else {
    return {
      ensRegistryAddress,
      ipfs: {
        rpc: {
          protocol: '',
          host: '',
          port: 0,
        },
        gateway: gatewayUrl,
      },
    }
  }
}

interface UseEnvironment extends AragonEnvironment {
  apmOptions: ApmOptions
  gasPrice: string,
}

export function useEnvironment(env: string): UseEnvironment {


  // Load config files
  const arapp = loadArappFile()

  // default environment (no arapp.json) uses different naming
  const environment = getEnvironment(env, arapp)

  const { network, registry, gasPrice } = environment

  const ipfsAragonGateway =
    network === 'rpc' ? IPFS_LOCAL_GATEWAY : IPFS_ARAGON_GATEWAY
  const ensAddress = registry || DEVCHAIN_ENS

  return {
    ...environment,
    apmOptions: configureApm(
      IPFS_RPC, // TODO: Check if we need to use Aragon node to publish (ipfs-rpc is An URI to the IPFS node used to publish files)
      ipfsAragonGateway,
      ensAddress
    ),
    gasPrice:
      gasPrice || DEFAULT_GAS_PRICE,
  }
}
