import React from 'react'
import { Field, GU, Help, Info } from '@aragon/ui'
import MultiTokenSelector from '../TokenSelector/MultiTokenSelector'
import { getDefaultTokens } from '../../helpers/tokens'
import useTokens from './hooks/useTokens'

const DEFAULT_TOKENS = getDefaultTokens()

function RedemptionsScreen() {
  const [tokens, actions, error] = useTokens()

  return (
    <div>
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

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        These settings determine which ERC20 assets held by the organization
        will be eligible for redemption.
      </Info>
    </div>
  )
}

export default RedemptionsScreen
