import React from 'react'
import { GU, Info } from '@aragon/ui'
import AppStoreApps from '../../AppRepoSelector/AppStoreApps'
import Header from '../Header'
import Navigation from '../../Navigation'
import { validateDAO } from '../../../utils'
import { useInstallerState } from '../../../providers/InstallerProvider'

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
        <AppStoreApps
          repos={appRepos}
          onSelect={onSelectRepo}
          selected={selectedAppRepos}
        />
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
