import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, GU, Info } from '@aragon/ui'
import ConfirmTransactionPath from '../../Transaction/ConfirmTransaction'
import TransactionStatus from '../../Transaction/TransactionStatus'
import { useWallet } from '../../../providers/Wallet'
import { useInstallerState } from '../../../providers/InstallerProvider'
import {
  TX_STATUS_SIGNED,
  TX_STATUS_PENDING,
  TX_STATUS_CONFIRMED,
  TX_STATUS_SIGNATURE_FAILED,
  TX_STATUS_FAILED,
} from '../../Transaction/transaction-statuses'
import Header from '../Header'
import { buildDaoUrl } from '../../../utils/utils'

const EMPTY_STATE = {
  signing: false,
  signed: false,
  confirmed: false,
  errorSigning: false,
  failed: false,
  rawTx: null,
}

function Install({ title }) {
  const { ethers } = useWallet()
  const [attempts, setAttempt] = useState(0)
  const [progress, setProgress] = useState(EMPTY_STATE)
  const { daoDomain } = useInstallerState()

  const handleInstall = useCallback(rawTx => {
    setProgress(progress => ({ ...progress, signing: true, rawTx }))
  }, [])

  const handleNextAttempt = useCallback(() => {
    setAttempt(attempt => attempt + 1)
  }, [])

  const signTx = useCallback(
    async rawTx => {
      try {
        const tx = await ethers.getSigner().sendTransaction(rawTx)
        setProgress(progress => ({ ...progress, signed: true }))

        return tx
      } catch (err) {
        setProgress(progress => ({ ...progress, errorSigning: true }))
      }
    },
    [ethers]
  )

  const ensureConfirmation = useCallback(async signedTx => {
    try {
      await signedTx.wait()
      setProgress(progress => ({ ...progress, confirmed: true }))
    } catch (err) {
      setProgress(progress => ({ ...progress, failed: true }))
    }
  }, [])

  useEffect(() => {
    if (!(progress.signing && progress.rawTx)) {
      return
    }

    setProgress(progress => ({
      ...progress,
      errorSigning: false,
      failed: false,
    }))

    const install = async () => {
      try {
        const signedTx = await signTx(progress.rawTx)

        await ensureConfirmation(signedTx)
      } catch (err) {
        console.error(err)
      }
    }

    install()
  }, [attempts, ensureConfirmation, progress.signing, progress.rawTx, signTx])

  const status = useMemo(() => {
    if (progress.errorSigning) {
      return TX_STATUS_SIGNATURE_FAILED
    }

    if (progress.failed) {
      return TX_STATUS_FAILED
    }

    if (progress.confirmed) {
      return TX_STATUS_CONFIRMED
    }

    if (progress.signed) {
      return TX_STATUS_SIGNED
    }

    return TX_STATUS_PENDING
  }, [progress])

  return (
    <div>
      <Header title={title} />
      {progress.signing ? (
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <TransactionStatus status={status} />
          <div
            css={`
              margin-top: ${2 * GU}px;
              text-align: center;
            `}
          >
            {status === TX_STATUS_CONFIRMED && (
              <>
                <Button
                  href={buildDaoUrl(daoDomain)}
                  label="Open DAO"
                  mode="strong"
                />
                <Info
                  css={`
                    margin-top: ${2 * GU}px;
                  `}
                >
                  A vote should have been created in your DAO. Head over to the
                  Voting app to finalize the installation process.
                </Info>
              </>
            )}
            {(status === TX_STATUS_FAILED ||
              status === TX_STATUS_SIGNATURE_FAILED) && (
              <Button label="Retry" mode="strong" onClick={handleNextAttempt} />
            )}
          </div>
        </div>
      ) : (
        <ConfirmTransactionPath onInstall={handleInstall} />
      )}
    </div>
  )
}

export default Install
