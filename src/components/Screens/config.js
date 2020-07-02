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
import DelayScreen from './Apps/DelayScreen'
import PayrollScreen from './Apps/PayrollScreen'
import RedemptionsScreen from './Apps/RedemptionsScreen'
import TokenRequestScreen from './Apps/TokenRequestScreen'
import { ETHER_TOKEN_FAKE_ADDRESS } from '../../helpers/tokens'
import { formatDuration } from '../kit/utils'
import { secondsToMonths, multiplierFromBase } from '../../utils/utils'

// For apps with no init params
const NO_PARAMS = [['No params', <div />]]

export const InstallerScreens = [
  { Screen: LoadDAO, title: 'Load DAO' },
  { Screen: ReviewDAOApps, title: 'Review apps' },
  { Screen: SelectRepos, title: 'Select repos', width: 'full-width' },
  { Screen: ConfigureApps, title: 'Configure apps', width: 600 },
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
    'delay',
    {
      Screen: DelayScreen,
      appLabel: 'Delay',
      processData: data => data,
      formatReviewFields: screenData => {
        return [
          [
            'Execution delay',
            <div>{formatDuration(screenData.executionDelay)}</div>,
          ],
        ]
      },
    },
  ],
  [
    'payroll',
    {
      Screen: PayrollScreen,
      appLabel: 'Payroll',
      processData: data => {
        const {
          denominationToken: { data: token },
          ...equitySettings
        } = data
        return { denominationToken: token.address, ...equitySettings }
      },
      formatReviewFields: screenData => {
        const {
          denominationToken: { data: token },
          equityMultiplier,
          vestingLength,
          vestingCliffLength,
          vestingRevokable,
        } = screenData

        const fields = [
          [
            'Denomination token',
            <div
              css={`
                display: grid;
                grid-template-columns: 1fr 2fr;
              `}
            >
              <span>{token.symbol || 'Custom token'}</span>
              {!addressesEqual(token.address, ETHER_TOKEN_FAKE_ADDRESS) && (
                <span>{shortenAddress(token.address)}</span>
              )}
            </div>,
          ],
          [
            'Equity multiplier',
            <span>{multiplierFromBase(equityMultiplier)} X</span>,
          ],
        ]

        if (vestingLength === 0) {
          fields.push(['Vesting', 'Disabled'])
        } else {
          fields.push(
            [
              'Vesting length',
              <span>{secondsToMonths(vestingLength)} months</span>,
            ],
            [
              'Vesting cliff length',
              <span>{secondsToMonths(vestingCliffLength)} months</span>,
            ],
            [
              'Vesting revokable',
              <span>{vestingRevokable ? 'True' : 'False'}</span>,
            ]
          )
        }

        return fields
      },
    },
  ],
  [
    'transactions',
    {
      appLabel: 'Transactions',
      formatReviewFields: () => NO_PARAMS,
    },
  ],
  [
    'agent',
    {
      appLabel: 'Agent',
      formatReviewFields: () => NO_PARAMS,
    },
  ],
])
