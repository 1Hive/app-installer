import React from 'react'
import { GU } from '@aragon/ui'
import screens from './config'
import { useInstallerState } from '../../providers/InstallerProvider'

function Screens() {
  const { step } = useInstallerState()

  const { Screen } = screens[step]

  return (
    <div
      css={`
        width: 50%;
        margin: 0 auto;
      `}
    >
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Screen />
      </div>
    </div>
  )
}

export default Screens
