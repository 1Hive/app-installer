import React from 'react'
import { GU } from '@aragon/ui'
import RepoCard from './RepoCard'
import AppStoreApps from './AppStoreApps'

function RepoCardGroup({ repos, onRepoSelected, selected }) {
  if (repos) {
    return (
      <AppStoreApps
        repos={repos}
        onSelect={onRepoSelected}
        selected={selected}
      />
    )
  }

  return (
    <div
      css={`
        display: grid;
        grid-template-columns: 1fr
        grid-auto-rows: ${21 * GU}px;
        grid-gap: ${2 * GU}px;
        margin-bottom: ${2 * GU}px;
      `}
    >
      {repos.map((repo, index) => (
        <RepoCard
          key={index}
          repo={repo}
          onRepoSelected={onRepoSelected}
          selected={selected?.some(elem => elem.appName === repo.appName)}
        />
      ))}
    </div>
  )
}

export default RepoCardGroup
