import React from 'react'
import { GU, Info } from '@aragon/ui'
import RepoCardGroup from './RepoCardGroup'
import { useInstallerState } from '../../providers/InstallerProvider'
import Navigation from '../Screens/Navigation'

function AppSelector() {
  const { appRepos, selectedAppRepos, onSelectRepo } = useInstallerState()

  return (
    <div>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <RepoCardGroup
          repos={appRepos}
          onRepoSelected={onSelectRepo}
          selected={selectedAppRepos}
          selectable
        />
        <Info>Select the apps you would like to install</Info>
      </div>
      <Navigation nextEnabled={Boolean(selectedAppRepos.length)} />
    </div>
  )
}

export default AppSelector
