import headerSvgAgent from './assets/agentHeader.svg'
import headerSvgDelay from './assets/delayHeader.svg'
import headerSvgRedemptions from './assets/redemptionsHeader.svg'
import headerSvgTokenRequest from './assets/tokenRequestHeader.svg'
import headerSvgTransactions from './assets/transactionsHeader.svg'

const HEADERS = new Map([
  ['agent', headerSvgAgent],
  ['delay', headerSvgDelay],
  ['redemptions', headerSvgRedemptions],
  ['token-request', headerSvgTokenRequest],
  ['transactions', headerSvgTransactions],
])

export default function getAppHeader(id) {
  return HEADERS.get(id)
}
