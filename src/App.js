import React, { useCallback, useState } from 'react'
import {
  Button,
  Field,
  GU,
  Info,
  LoadingRing,
  Main,
  TextInput,
  textStyle,
} from '@aragon/ui'

import useDAO from './hooks/useDAO'
import useAvailableRepos from './hooks/useAvailableRepos'
import { validateDAO } from './utils'
import AppList from './components/AppList'
import { installApps } from './installApps'

function App() {
  const [error, setError] = useState(null)
  const [daoAddress, setDAOAddress] = useState('')
  const [selectedApps, setSelectedApps] = useState([])

  const [defaultApps, daoApps, loadingApps] = useDAO(daoAddress)
  const [repos, loadingRepos] = useAvailableRepos()

  const handleDAOAddressChange = useCallback(event => {
    const newDAOAddress = event.target.value
    setDAOAddress(newDAOAddress)
  }, [])

  const handleAppSelected = useCallback(
    (name, selected) => {
      const index = selectedApps.findIndex(appName => appName === name)
      const updatedApps = selected
        ? [...selectedApps, name]
        : [...selectedApps.slice(0, index), ...selectedApps.slice(index + 1)]
      return setSelectedApps(updatedApps.sort())
    },
    [selectedApps]
  )

  const handleAppInstall = useCallback(() => {
    const selectedAppsForInstallation = repos.filter(repo =>
      selectedApps.includes(repo.name)
    )

    const error = validateDAO(daoApps, selectedAppsForInstallation)
    if (error) {
      return setError(error)
    }

    console.log('repos', repos)
    console.log('selectedAppsForInstallation', selectedAppsForInstallation)

    installApps(
      daoAddress,
      [...defaultApps, ...daoApps],
      selectedAppsForInstallation
    )
  }, [daoAddress, daoApps, defaultApps, repos, selectedApps])

  console.log('repos', repos)

  return (
    <Main>
      <div
        css={`
          padding: ${10 * GU}px 0;
        `}
      >
        <div
          css={`
            width: 50%;
            margin: 0 auto;
          `}
        >
          <header>
            <h1
              css={`
                ${textStyle('title1')};
                margin-bottom: ${2 * GU}px;
                font-weight: 200;
              `}
            >
              Dao app installer
            </h1>
          </header>
          <div
            css={`
              margin-bottom: ${2 * GU}px;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <Field
                label="Dao address"
                css={`
                  width: 100%;
                `}
              >
                <TextInput
                  value={daoAddress}
                  onChange={handleDAOAddressChange}
                  wide
                />
              </Field>
              {loadingApps && <LoadingRing />}
            </div>
            <AppList apps={daoApps} mode="table" />
          </div>
          <div
            css={`
              margin-bottom: ${2 * GU}px;
            `}
          >
            <h2
              css={`
                ${textStyle('title4')};
                margin-bottom: ${1 * GU}px;
              `}
            >
              Select the apps you'd like to install
            </h2>
            {loadingRepos && <LoadingRing />}
            <AppList
              apps={repos}
              onAppSelected={handleAppSelected}
              selected={selectedApps}
              selectable
            />
          </div>
          <Button
            label="Install"
            mode="strong"
            wide
            onClick={handleAppInstall}
          />
          {error && <Info mode="warning">{error}</Info>}
        </div>
      </div>
    </Main>
  )
}

export default App
