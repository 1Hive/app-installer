import React from 'react'
import { addressesEqual, shortenAddress } from '@aragon/ui'

import AppConfiguration from './AppConfiguration'
import AppSelector from '../AppRepoSelector/AppRepoSelector'
import DaoApps from '../Dao/DaoApps'
import DaoLoader from '../Dao/DaoLoader'
import Install from '../Installer/Install'
import ReviewScreen from './Review'
import RedemptionsScreen from './RedemptionsScreen'
import TokenRequestScreen from './TokenRequestScreen'
import { ETHER_TOKEN_FAKE_ADDRESS } from '../../helpers/tokens'

export const InstallerScreens = [
  { Screen: DaoLoader },
  { Screen: DaoApps },
  { Screen: AppSelector },
  { Screen: AppConfiguration },
  { Screen: ReviewScreen },
  { Screen: Install },
]

export const AppConfigScreens = new Map([
  [
    'redemptions',
    {
      Screen: RedemptionsScreen,
      appLabel: 'Redemptions',
      processData: data => ({
        redeemableTokens: data.redeemableTokens.map(
          ({ token }) => token.address
        ),
      }),
      formatReviewFields: screenData => {
        return [
          [
            'Redeemable tokens',
            <div>
              {screenData.redeemableTokens.map(({ token }, index) => (
                <div
                  key={index}
                  css={`
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                  `}
                >
                  <span>{token.symbol || 'Custom token'}</span>
                  {!addressesEqual(token.address, ETHER_TOKEN_FAKE_ADDRESS) && (
                    <span> {shortenAddress(token.address)}</span>
                  )}
                </div>
              ))}
            </div>,
          ],
        ]
      },
    },
  ],
  [
    'token-request',
    {
      Screen: TokenRequestScreen,
      appLabel: 'Token Request',
      processData: data => ({
        acceptedTokens: data.acceptedTokens.map(({ token }) => token.address),
      }),
      formatReviewFields: screenData => {
        return [
          [
            'Accepted tokens',
            <div>
              {screenData.acceptedTokens.map(({ token }, index) => (
                <div
                  key={index}
                  css={`
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                  `}
                >
                  <span>{token.symbol || 'Custom token'}</span>
                  {!addressesEqual(token.address, ETHER_TOKEN_FAKE_ADDRESS) && (
                    <span> {shortenAddress(token.address)}</span>
                  )}
                </div>
              ))}
            </div>,
          ],
        ]
      },
    },
  ],
])
