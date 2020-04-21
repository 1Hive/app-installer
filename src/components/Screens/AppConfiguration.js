import React from 'react'
import { GU } from '@aragon/ui'
import { useInstallerState } from '../../providers/InstallerProvider'
import Navigation from './Navigation'
import RedemptionsScreen from './RedemptionsScreen'
import TokenRequestScreen from './TokenRequestScreen'

const screens = new Map([
  [
    'redemptions.aragonpm.eth',
    { Screen: RedemptionsScreen, appLabel: 'Redemptions' },
  ],
  [
    'token-request.aragonpm.eth',
    { Screen: TokenRequestScreen, appLabel: 'Token Request' },
  ],
])

function AppConfiguration() {
  const { selectedAppRepos } = useInstallerState()

  return (
    <div>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        {selectedAppRepos.map((appRepo, index) => {
          const { Screen, appLabel } = screens.get(appRepo)

          return <Screen key={index} appLabel={appLabel} />
        })}
      </div>
      <Navigation nextLabel="Install!" onNext />
    </div>
  )
}

export default AppConfiguration
