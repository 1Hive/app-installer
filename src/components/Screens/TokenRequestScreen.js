import React from 'react'
import { Field, GU, Help, Info } from '@aragon/ui'
import MultiTokenSelector from '../TokenSelector/MultiTokenSelector'
import { getDefaultTokens } from '../../helpers/tokens'
import useTokens from './hooks/useTokens'

const DEFAULT_TOKENS = getDefaultTokens()

function TokenRequestScreen() {
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

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        These settings will determine which assets will be accepted as payment
        in exchange for the organization's tokens.
      </Info>
    </div>
  )
}

export default TokenRequestScreen
