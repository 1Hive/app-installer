import React from 'react'
import { Button, GU, textStyle } from '@aragon/ui'
import AccountModule from '../Account/AccountModule'
import Network from '../Network/Network'
import { useAppTheme } from '../../providers/ThemeProvider'

import moonSvg from '../../assets/moon.svg'
import moonDarkSvg from '../../assets/moon-dark.svg'

function MainHeader() {
  const { appearance, toggleAppearance } = useAppTheme()

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
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <AccountModule />
        <Network />
        <Button
          icon={
            <img
              height="20"
              width="20"
              src={appearance === 'light' ? moonSvg : moonDarkSvg}
            />
          }
          onClick={toggleAppearance}
          css={`
            margin-left: ${1 * GU}px;
          `}
        />
      </div>
    </header>
  )
}

export default MainHeader
