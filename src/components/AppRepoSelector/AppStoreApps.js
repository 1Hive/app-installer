import React from 'react'
import { GU } from '@aragon/ui'
import AppStoreApp from './AppStoreApp'

function AppStoreApps({ repos, onSelect, selected }) {
  return (
    <div
      css={`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(267px, 1fr));
        grid-gap: ${1.5 * GU}px;
        margin-bottom: ${2 * GU}px;
      `}
    >
      {repos.map((repo, index) => {
        const isSelected = selected?.some(elem => elem.appName === repo.appName)
        return (
          <AppStoreApp
            key={index}
            onSelect={onSelect}
            repo={repo}
            selected={isSelected}
          />
        )
      })}
    </div>
  )
}

export default AppStoreApps
