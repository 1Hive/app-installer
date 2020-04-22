import React, { useCallback } from 'react'
import { AppBadge, Box, Field, GU, Help, Info } from '@aragon/ui'
import MultiTokenSelector from '../TokenSelector/MultiTokenSelector'
import { getDefaultTokens } from '../../helpers/tokens'
import useTokens from './hooks/useTokens'
import Navigation from '../Navigation'

const DEFAULT_TOKENS = getDefaultTokens()

const TokenRequestScreen = React.forwardRef(function TokenRequestScreen(
  {
    appLabel,
    blurr,
    data,
    dataKey,
    iconSrc,
    screenProps: { navigate, onBack, onNext },
  },
  ref
) {
  const screenData = data?.[dataKey]
  const [tokens, actions, error] = useTokens(screenData?.acceptedTokens)

  const handleNext = useCallback(() => {
    if (actions.validate()) {
      return onNext({ [dataKey]: { acceptedTokens: tokens } })
    }
  }, [actions, dataKey, onNext, tokens])

  return (
    <Box
      padding={4 * GU}
      css={`
        position: relative;
      `}
    >
      <div ref={ref}>
        <div
          css={`
            margin-bottom: ${5 * GU}px;
          `}
        >
          <span
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            Choose your
            <span
              css={`
                display: flex;
                margin: 0 ${1.5 * GU}px;
              `}
            >
              <AppBadge badgeOnly iconSrc={iconSrc} label={appLabel} />
            </span>
            settings.
          </span>
        </div>
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          <Field
            label={
              <React.Fragment>
                Accepted Tokens
                <Help hint="What are the accepted tokens?">
                  <strong>Accepted tokens</strong> are ERC20 tokens that will be
                  accepted as payment in exchange for the organization's tokens
                </Help>
              </React.Fragment>
            }
            css={`
              margin: 0;
            `}
          />
          <MultiTokenSelector
            onAddToken={actions.add}
            onRemoveToken={actions.remove}
            onUpdateToken={actions.update}
            tokens={tokens}
            items={DEFAULT_TOKENS}
          />
        </div>

        {error && (
          <Info
            mode="error"
            css={`
              margin-bottom: ${3 * GU}px;
            `}
          >
            {error}
          </Info>
        )}

        <Info>
          These settings will determine which assets will be accepted as payment
          in exchange for the organization's tokens.
        </Info>
        <div
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          {navigate && (
            <Navigation
              backEnabled={Boolean(onBack)}
              onNext={handleNext}
              onBack={onBack}
            />
          )}
        </div>
      </div>
      {blurr && (
        <div
          css={`
            position: absolute;
            opacity: 0.9;
            background: #f9fafc;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          `}
        />
      )}
    </Box>
  )
})

TokenRequestScreen.defaultProps = {
  appLabel: 'Token Request',
  dataKey: 'token-request',
}

export default TokenRequestScreen
