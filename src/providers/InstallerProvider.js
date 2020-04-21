import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useResolveDomain } from '../check-domain'
import useDaoApps from '../hooks/useDaoApps'
import useAppRepos from '../hooks/useAppRepos'

const InstallerContext = React.createContext()

function InstallerProvider({ children }) {
  const [step, setStep] = useState(0)
  const [daoDomain, setDaoDomain] = useState('')
  const [selectedAppRepos, setSelectedAppRepos] = useState([])

  // Try to resolve dao domain to dao address
  const [daoAddress, domainStatus] = useResolveDomain(daoDomain)

  // Get Organization's installed apps
  const [{ apps }, loadingApps] = useDaoApps(daoAddress)

  // Fetch apps available for installation repos
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
    name => {
      const index = selectedAppRepos.findIndex(appName => appName === name)
      const updatedApps =
        index >= 0
          ? [
              ...selectedAppRepos.slice(0, index),
              ...selectedAppRepos.slice(index + 1),
            ]
          : [...selectedAppRepos, name]
      return setSelectedAppRepos(updatedApps.sort())
    },
    [selectedAppRepos]
  )

  return (
    <InstallerContext.Provider
      value={{
        appRepos,
        daoAddress,
        daoApps: apps,
        daoDomain,
        domainStatus,
        loadingApps,
        onBack: handlePrevStep,
        onNext: handleNextStep,
        onSelectRepo: handleRepoSelected,
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
