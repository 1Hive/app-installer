import { TransactionReceipt } from 'web3-core'
import { TransactionRevertInstructionError } from 'web3-core-helpers'
import { useEnvironment } from '../helpers/useEnvironment'
import { initWrapper } from './utils/wrapper'

/**
 * Execute multiple methods on different DAO's apps.
 *
 * @param dao Dao address
 * @param intentBasket Intent basket
 * @param environment Environment
 * @returns Transaction path and receipt
 */
export async function execAppMethods(
  dao: string,
  intentBasket: Array<any>,
  environment: string
): Promise<{
  path: string
  receipt: TransactionReceipt | TransactionRevertInstructionError
}> {
  const { web3 } = useEnvironment(environment)
  const wrapper = await initWrapper(dao, environment)


  const transactionPath = await wrapper.getTransactionPathForIntentBasket(intentBasket)

  console.log('path ofr intent basket', transactionPath)

  if (!transactionPath.transactions.length)
    throw new Error('Cannot find transaction path for executing action')

  const path = transactionPath.path
  const transaction = transactionPath.transactions[0]

  return {
    path,
    receipt: await web3.eth.sendTransaction(transaction),
  }
}
