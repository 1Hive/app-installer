import React from 'react'
import { GU, textStyle } from '@aragon/ui'
import AccountModule from '../Account/AccountModule'

function MainHeader() {
  return (
    <header
      css={`
        padding: ${2 * GU}px ${4 * GU}px;
        display: flex;
        justify-content: space-between;
      `}
    >
      <div>
        <h3
          css={`
            ${textStyle('title3')};
            margin-bottom: ${2 * GU}px;
            font-weight: 200;
          `}
        >
          App installer
        </h3>
      </div>
      <AccountModule />
    </header>
  )
}

export default MainHeader
