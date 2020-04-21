import ethers from 'ethers'
import { getTransactionPath } from './acl/getTransactionPath'
import { useEnvironment } from '../helpers/useEnvironment'

/**
 * Execute a method on a DAO's app.
 *
 * @param dao DAO name or address
 * @param app App address
 * @param method Method name
 * @param params Method parameters
 * @param progressHandler Progress handler
 * @param environment Environment
 * @returns Transaction path and receipt
 */
export async function execAppMethod(
  dao: string,
  app: string,
  method: string,
  params: any[],
  progressHandler: (progressId: number) => void | undefined,
  environment: string,
  provider: ethers.providers.Web3Provider
): Promise<{
  transactionPath: string
}> {

  if (progressHandler) progressHandler(1)

  const transactionPath = (
    await getTransactionPath(dao, app, method, params, environment, provider)
  )[0]

  if (!transactionPath)
    throw new Error('Cannot find transaction path for executing action')

  if (progressHandler) progressHandler(2)

  return {
    transactionPath
  }
}
