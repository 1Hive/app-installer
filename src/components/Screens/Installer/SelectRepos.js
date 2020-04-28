import React from 'react'
import { GU, Info } from '@aragon/ui'
import RepoCardGroup from '../../AppRepoSelector/RepoCardGroup'
import { useInstallerState } from '../../../providers/InstallerProvider'
import Navigation from '../../Navigation'
import { validateDAO } from '../../../utils'
import Header from '../Header'

function SelectRepos({ title }) {
  const {
    appRepos,
    daoApps,
    onBack,
    onNext,
    onSelectRepo,
    selectedAppRepos,
  } = useInstallerState()

  const error = validateDAO(daoApps, selectedAppRepos)

  return (
    <div>
      <Header title={title} />
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
      {error && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {error}
        </Info>
      )}
      <Navigation
        nextEnabled={!error && Boolean(selectedAppRepos.length)}
        onBack={onBack}
        onNext={onNext}
      />
    </div>
  )
}

export default SelectRepos
