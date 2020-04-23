import React, { useCallback, useEffect, useState } from 'react'
import { Button, GU, IconCheck, Info, LoadingRing, useTheme } from '@aragon/ui'
import { useWallet } from '../../providers/Wallet'
import { useInstallerState } from '../../providers/InstallerProvider'
import { getInstallRawTx } from '../../installer-utils'

function ConfirmTransactionPath({ onInstall }) {
  const { ethers } = useWallet()
  const {
    appsConfig,
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

  const handleInstall = useCallback(() => {
    onInstall(rawTx)
  }, [onInstall, rawTx])

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
          appsConfig,
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
    appsConfig,
    attempt,
    daoAddress,
    daoApps,
    daoAppsInternal,
    ethers,
    rawTx,
    selectedAppRepos,
  ])

  return (
    <div>
      {!error && <TxPathStatus loading={loading} />}
      <div
        css={`
          margin-top: ${2 * GU}px;
          text-align: center;
        `}
      >
        <Button
          label={error ? 'Retry' : 'Install apps!'}
          disabled={loading}
          onClick={error ? handleNextAttempt : handleInstall}
          css="width: 50%"
        />
      </div>
      {error && (
        <Info
          css={`
            margin-top: ${2 * GU}px;
          `}
          mode="error"
        >
          {error}
        </Info>
      )}
    </div>
  )
}

function TxPathStatus({ loading }) {
  const theme = useTheme()
  const text = loading ? 'Calculating tx path' : 'Tx path found!'

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        width: ${22 * GU}px;
        margin: 0 auto;
      `}
    >
      <div
        css={`
          display: flex;
          margin-right: ${0.5 * GU}px;
        `}
      >
        {loading ? <LoadingRing /> : <IconCheck color={theme.positive} />}
      </div>
      <span
        css={`
          color: ${loading ? theme.content : theme.positive};
        `}
      >
        {text}
      </span>
    </div>
  )
}

export default ConfirmTransactionPath
