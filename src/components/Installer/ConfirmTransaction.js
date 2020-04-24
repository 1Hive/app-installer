import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Button,
  GU,
  IconCheck,
  IconCross,
  LoadingRing,
  useTheme,
} from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import { useInstallerState } from '../../providers/InstallerProvider'
import { getInstallRawTx } from '../../utils/installer-utils'

function ConfirmTransactionPath({ onInstall }) {
  const { ethers } = useWallet()
  const {
    appsSettings,
    daoAddress,
    daoApps,
    daoAppsInternal,
    selectedAppRepos,
  } = useInstallerState()

  const [rawTx, setRawTx] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleNextAttempt = useCallback(() => {
    setAttempt(attempt => attempt + 1)
  }, [])

  const handleInstall = useCallback(
    event => {
      event.preventDefault()

      if (error) {
        return handleNextAttempt()
      }

      onInstall(rawTx)
    },
    [error, handleNextAttempt, onInstall, rawTx]
  )

  useEffect(() => {
    if (rawTx) {
      return
    }

    const getTransactionPath = async () => {
      setLoading(true)
      setError(false)

      try {
        // TODO: return script executor so we can link to the app that will most likely execute the installation
        const rawTx = await getInstallRawTx(
          daoAddress,
          daoApps.concat(daoAppsInternal),
          selectedAppRepos,
          appsSettings,
          ethers
        )

        setRawTx(rawTx)
      } catch (err) {
        console.error(err)
        setError(err.message)
      }

      setLoading(false)
    }

    getTransactionPath()
  }, [
    appsSettings,
    attempt,
    daoAddress,
    daoApps,
    daoAppsInternal,
    ethers,
    rawTx,
    selectedAppRepos,
  ])

  return (
    <form onSubmit={handleInstall}>
      <TxPathStatus loading={loading} error={error} />
      <div
        css={`
          margin-top: ${2 * GU}px;
          text-align: center;
        `}
      >
        <Button
          label={error ? 'Retry' : 'Install apps!'}
          disabled={loading}
          mode="strong"
          css="width: 50%"
          type="submit"
        />
      </div>
    </form>
  )
}

function TxPathStatus({ loading, error }) {
  const theme = useTheme()
  const { Icon, color, labelText } = useMemo(() => {
    if (loading) {
      return {
        Icon: LoadingRing,
        color: theme.contentSecondary,
        labelText: 'Calculating tx path',
      }
    }

    if (error) {
      return {
        Icon: IconCross,
        color: theme.negative,
        labelText: error,
      }
    }

    return {
      Icon: IconCheck,
      color: theme.positive,
      labelText: 'Tx path found!',
    }
  }, [error, loading, theme])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${color};
      `}
    >
      <div
        css={`
          display: flex;
          margin-right: ${0.5 * GU}px;
        `}
      >
        <Icon />
      </div>
      <span>{labelText}</span>
    </div>
  )
}

export default ConfirmTransactionPath
