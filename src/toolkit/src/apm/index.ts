import { AragonApmRepoData, ApmVersion, AragonJsIntent } from './types'
import { useEnvironment } from '../helpers'
import { Repo } from './repo'

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
  environment: string
): Promise<AragonApmRepoData> {
  const { apmOptions, web3 } = useEnvironment(environment)


  const repo = Repo(web3.givenProvider)
  return repo.getVersionContent(apmRepoName, apmRepoVersion, {
    ipfsGateway: apmOptions.ipfs.gateway,
  })
}