import ethers from 'ethers'
import { getWrapper } from './utils/wrapper'

/**
 * Get transaction path from intent basket
 *
 * @param dao Dao address
 * @param intentBasket Intent basket
 * @param environment Environment
 * @returns Transaction path and receipt
 */
export async function getTransactionPathFromIntentBasket(
  dao: string,
  intentBasket: Array<any>,
  environment: string,
  provider: ethers.providers.Web3Provider
): Promise<{
  path: string
  transaction: object
}> {
  const wrapper = await getWrapper(dao, environment, provider)

  const transactionPath = await wrapper.getTransactionPathForIntentBasket(intentBasket, { checkMode: 'single' })

  if (!transactionPath.transactions.length)
    throw new Error('Cannot find transaction path for executing action')

  const path = transactionPath.path
  const transaction = transactionPath.transactions[0]

  return {
    path,
    transaction
  }
}
