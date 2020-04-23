import React, { useMemo } from 'react'
import { GU, IconCheck, IconCross, useTheme } from '@aragon/ui'
import {
  TX_STATUS_FAILED,
  TX_STATUS_SIGNATURE_FAILED,
  TX_STATUS_CONFIRMED,
  TX_STATUS_SIGNED,
} from './transaction-statuses'

function TransactionStatus({ status }) {
  const theme = useTheme()

  const { iconColor, labelColor, labelText } = useMemo(() => {
    if (status === TX_STATUS_SIGNATURE_FAILED || status === TX_STATUS_FAILED) {
      return {
        iconColor: theme.negative,
        labelColor: theme.negative,
        labelText:
          status === TX_STATUS_SIGNATURE_FAILED
            ? 'Signing transaction failed!'
            : 'Transaction failed',
      }
    }

    if (status === TX_STATUS_CONFIRMED) {
      return {
        iconColor: theme.positive,
        labelColor: theme.positive,
        labelText: 'Transaction confirmed!',
      }
    }

    if (status === TX_STATUS_SIGNED) {
      return {
        iconColor: theme.info,
        labelColor: theme.contentSecondary,
        labelText: 'Transaction being mined…',
      }
    }

    return {
      iconColor: theme.contentSecondary,
      labelText: 'Waiting for signature…',
    }
  }, [status, theme])

  const failed =
    status === TX_STATUS_SIGNATURE_FAILED ||
    status === TX_STATUS_SIGNATURE_FAILED

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${7.5 * GU}px;
          height: ${7.5 * GU}px;
          border: 2px solid ${iconColor};
          border-radius: 50%;
          transition: border-color 150ms ease-in-out;
        `}
      >
        {failed ? (
          <IconCross
            size="medium"
            css={`
              color: ${iconColor};
              transition: color 150ms ease-in-out;
            `}
          />
        ) : (
          <IconCheck
            size="medium"
            css={`
              color: ${iconColor};
              transition: color 150ms ease-in-out;
            `}
          />
        )}
      </div>
      <p
        css={`
          margin-top: ${3 * GU}px;
          color: ${labelColor};
        `}
      >
        {labelText}
      </p>
    </div>
  )
}

export default TransactionStatus
