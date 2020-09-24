import React, { useEffect, useRef } from 'react'
import { Field, GU, Info, LoadingRing, TextInput, useTheme } from '@aragon/ui'
import { useInstallerState } from '../../../providers/InstallerProvider'
import CheckDisc from '../../CheckDisk'
import Header from '../Header'
import Navigation from '../../Navigation'
import {
  DOMAIN_CHECK,
  DOMAIN_ERROR,
  DOMAIN_LOADING,
  DOMAIN_NONE,
} from '../../../check-domain'
import { ARAGON_DOMAIN } from '../../../lib/web3-utils'

function LoadDAO({ title }) {
  const theme = useTheme()
  const {
    daoDomain,
    domainStatus,
    onNext,
    onUpdateDaoDomain,
  } = useInstallerState()

  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        // Component could have been unmounted on timeout
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 1500)
    }
  }, [])

  return (
    <div>
      <Header title={title} />
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <Field
          label="Dao domain"
          css={`
            width: 100%;
          `}
        >
          <TextInput
            value={daoDomain}
            onChange={onUpdateDaoDomain}
            wide
            adornment={
              <div
                css={`
                  display: flex;
                  align-items: center;
                  height: calc(100% - 2px);
                  margin: 1px 0;
                  padding: 0 ${2 * GU}px;
                  border-left: 1px solid ${theme.border};
                  background: ${theme.surface};
                `}
              >
                {ARAGON_DOMAIN}
              </div>
            }
            adornmentPosition="end"
            ref={inputRef}
          />
        </Field>
        {domainStatus !== DOMAIN_NONE && (
          <div
            css={`
              display: flex;
              align-items: center;
              height: ${5 * GU}px;
              margin-left: ${2 * GU}px;
            `}
          >
            {domainStatus === DOMAIN_CHECK && <CheckDisc mode="success" />}
            {domainStatus === DOMAIN_ERROR && <CheckDisc mode="error" />}
            {domainStatus === DOMAIN_LOADING && (
              <LoadingRing
                css={`
                  width: ${3 * GU}px;
                  height: ${3 * GU}px;
                `}
              />
            )}
          </div>
        )}
      </div>
      <Info
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        Please select your organization
      </Info>
      <Navigation
        nextEnabled={domainStatus === DOMAIN_CHECK}
        onNext={onNext}
        showBack={false}
      />
    </div>
  )
}

export default LoadDAO
