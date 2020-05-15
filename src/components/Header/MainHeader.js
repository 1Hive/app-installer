import React from 'react'
import { Button, GU, textStyle, useViewport } from '@aragon/ui'
import AccountModule from '../Account/AccountModule'
import Network from '../Network/Network'
import { useAppTheme } from '../../providers/ThemeProvider'

import moonSvg from '../../assets/moon.svg'
import moonDarkSvg from '../../assets/moon-dark.svg'

function MainHeader() {
  const { appearance, toggleAppearance } = useAppTheme()
  const { below } = useViewport()
  const compactMode = below('medium')

  return (
    <header
      css={`
        padding: ${2 * GU}px ${4 * GU}px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 390px;
      `}
    >
      <div>
        <h3
          css={`
            ${textStyle('title3')};
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
        <AccountModule compact={compactMode} />
        <Network compact={compactMode} />
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
          display="icon"
          label="dark mode"
        />
      </div>
    </header>
  )
}

export default MainHeader
