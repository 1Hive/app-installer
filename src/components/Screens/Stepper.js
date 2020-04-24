import React from 'react'
import { useTheme } from '@aragon/ui'
import { InstallerScreens } from './config'
import { useInstallerState } from '../../providers/InstallerProvider'

function Stepper() {
  const theme = useTheme()
  const { step } = useInstallerState()
  const steps = InstallerScreens
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      {steps.map(({ title }, index) => {
        const active = index === step
        return (
          <div>
            <div
              css={`
                color: ${active ? theme.info : theme.content};
              `}
            >
              {index + 1}
            </div>
            <span>{title}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
