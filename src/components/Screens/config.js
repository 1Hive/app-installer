import React from 'react'
import { addressesEqual, shortenAddress } from '@aragon/ui'

// Installer step screens
import ConfigureApps from './Installer/ConfigureApps'
import Install from './Installer/Install'
import LoadDAO from './Installer/LoadDAO'
import ReviewConfiguration from './Installer/ReviewConfiguration'
import ReviewDAOApps from './Installer/ReviewDAOApps'
import SelectRepos from './Installer/SelectRepos'

// App screens
import RedemptionsScreen from './Apps/RedemptionsScreen'
import TokenRequestScreen from './Apps/TokenRequestScreen'
import { ETHER_TOKEN_FAKE_ADDRESS } from '../../helpers/tokens'

export const InstallerScreens = [
  { Screen: LoadDAO, title: 'Load DAO' },
  { Screen: ReviewDAOApps, title: 'Review apps' },
  { Screen: SelectRepos, title: 'Select repos', width: 'full-width' },
  { Screen: ConfigureApps, title: 'Configure apps' },
  { Screen: ReviewConfiguration, title: 'Review configuration' },
  { Screen: Install, title: 'Install apps' },
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
        acceptedTokens: data.acceptedTokens
          .map(({ token }) => token.address)
          .sort(),
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
  [
    'transactions',
    {
      appLabel: 'Transactions',
      formatReviewFields: () => {
        return [['No params', <div />]]
      },
    },
  ],
])
