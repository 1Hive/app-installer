import { AragonApmRepoData } from './types'
import { useEnvironment } from '../helpers'
import { Repo } from './repo'
import { ethers } from 'ethers'

/**
 * Return a Repo object from aragonPM
 * @param apmRepoName APM repo name
 * @param apmRepoVersion APM repo version
 * @param  environment Envrionment
 * @returns  Repo
 */
export async function getApmRepo(
  apmRepoName: string,
  apmRepoVersion = 'latest',
  environment: string,
  provider: ethers.providers.Provider
): Promise<AragonApmRepoData> {

  const { apmOptions } = useEnvironment(environment)


  const repo = Repo(provider)
  return repo.getVersionContent(apmRepoName, apmRepoVersion, {
    ipfsGateway: apmOptions.ipfs.gateway,
  })
}