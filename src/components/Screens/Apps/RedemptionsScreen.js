import React, { useCallback } from 'react'
import { AppBadge, Box, Field, GU, Help, Info } from '@aragon/ui'
import MultiTokenSelector from '../../TokenSelector/MultiTokenSelector'
import { getDefaultTokens } from '../../../helpers/tokens'
import useTokens from '../hooks/useTokens'
import Navigation from '../../Navigation'

const DEFAULT_TOKENS = getDefaultTokens()

function RedemptionsScreen({
  appLabel,
  data,
  dataKey,
  iconSrc,
  screenProps: { navigate, onBack, onNext },
}) {
  const screenData = data?.[dataKey]
  const [tokens, actions, error] = useTokens(screenData?.redeemableTokens)

  const handleNext = useCallback(() => {
    if (actions.validate()) {
      return onNext({ [dataKey]: { redeemableTokens: tokens } })
    }
  }, [actions, dataKey, onNext, tokens])

  return (
    <Box padding={4 * GU}>
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
              Redeemable tokens
              <Help hint="What are redeemable tokens?">
                <strong>Redeemable tokens</strong> are ERC20 tokens that can be
                redeemed in exchange for the organization's tokens. They
                represent assets held by the organization.
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
        These settings determine which ERC20 assets held by the organization
        will be eligible for redemption.
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
    </Box>
  )
}

RedemptionsScreen.defaultProps = {
  appLabel: 'Redemptions',
  dataKey: 'redemptions',
}

export default RedemptionsScreen
