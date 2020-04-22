import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import useDaoApps from '../hooks/useDaoApps'
import useAppRepos from '../hooks/useAppRepos'
import { useWallet } from './Wallet'
import { useResolveDomain } from '../check-domain'
import { getInstallRawTx } from '../installer-utils'

const InstallerContext = React.createContext()

function InstallerProvider({ children }) {
  const [step, setStep] = useState(0)
  const [daoDomain, setDaoDomain] = useState('')
  const [selectedAppRepos, setSelectedAppRepos] = useState([])
  const [appsConfig, setAppsConfig] = useState(null)
  const { ethers } = useWallet()

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

  const handleInstall = useCallback(
    async appsSettings => {
      try {
        const rawTx = await getInstallRawTx(
          daoAddress,
          [...apps, ...internal],
          selectedAppRepos,
          appsSettings,
          ethers
        )

        console.log('rawTx', rawTx)

        // Send tx
        const tx = await ethers.getSigner().sendTransaction(rawTx)
        console.log('signed')
        await tx.wait()
        console.log('confirmed')
      } catch (err) {
        // TODO: Display error onUI
        console.error('Could not calculate tx path', err)
      }
    },
    [apps, daoAddress, ethers, internal, selectedAppRepos]
  )

  return (
    <InstallerContext.Provider
      value={{
        appRepos,
        appsConfig,
        daoAddress,
        daoApps: apps,
        daoDomain,
        domainStatus,
        loadingApps,
        onBack: handlePrevStep,
        onInstall: handleInstall,
        onNext: handleNextStep,
        onSelectRepo: handleRepoSelected,
        onUpdateAppsConfig: handleAppsConfigChange,
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
