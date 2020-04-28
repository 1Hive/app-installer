import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useDaoApps from '../hooks/useDaoApps'
import useAppRepos from '../hooks/useAppRepos'
import { useResolveDomain } from '../check-domain'

const InstallerContext = React.createContext()

function InstallerProvider({ children }) {
  const [step, setStep] = useState(0)
  const [daoDomain, setDaoDomain] = useState('')
  const [appsConfig, setAppsConfig] = useState(null)
  const [appsSettings, setAppsSettings] = useState(null)
  const [selectedAppRepos, setSelectedAppRepos] = useState([])

  // Try to resolve dao domain to dao address
  const [daoAddress, domainStatus] = useResolveDomain(daoDomain)
  const [{ apps, internal }, loadingApps] = useDaoApps(daoAddress)
  const appRepos = useAppRepos()

  const handleDomainChange = useCallback(event => {
    const newDaoDomain = event.target.value
    setDaoDomain(newDaoDomain)
  }, [])

  const handlePrevStep = useCallback(() => {
    return setStep(step => Math.max(0, step - 1))
  }, [])

  const handleNextStep = useCallback(() => {
    return setStep(step => step + 1)
  }, [])

  // Repo selector handler
  const handleRepoSelected = useCallback(
    repo => {
      const index = selectedAppRepos.findIndex(
        appRepo => appRepo.appName === repo.appName
      )
      const updatedApps =
        index >= 0
          ? [
              ...selectedAppRepos.slice(0, index),
              ...selectedAppRepos.slice(index + 1),
            ]
          : [...selectedAppRepos, repo]
      return setSelectedAppRepos(
        updatedApps.sort((a1, a2) => a1.name < a2.name)
      )
    },
    [selectedAppRepos]
  )

  const handleAppsConfigChange = useCallback(data => {
    setAppsConfig(data)
  }, [])

  const handleAppsSettingsChange = useCallback(settings => {
    setAppsSettings(settings)
  }, [])

  useEffect(() => {
    if (!daoAddress) {
      setStep(0)
    }
  }, [daoAddress])

  return (
    <InstallerContext.Provider
      value={{
        appRepos,
        appsConfig,
        appsSettings,
        daoAddress,
        daoApps: apps,
        daoAppsInternal: internal,
        daoDomain,
        domainStatus,
        loadingApps,
        onBack: handlePrevStep,
        onNext: handleNextStep,
        onSelectRepo: handleRepoSelected,
        onUpdateAppsConfig: handleAppsConfigChange,
        onUpdateAppsSettings: handleAppsSettingsChange,
        onUpdateDaoDomain: handleDomainChange,
        selectedAppRepos,
        step,
      }}
    >
      {children}
    </InstallerContext.Provider>
  )
}

InstallerProvider.propTypes = {
  children: PropTypes.node,
}

function useInstallerState() {
  return useContext(InstallerContext)
}

export { InstallerProvider, useInstallerState }
