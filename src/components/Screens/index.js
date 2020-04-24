import React, { useEffect, useState } from 'react'
import { GU, springs } from '@aragon/ui'
import { Transition, animated } from 'react-spring/renderprops'
import { InstallerScreens } from './config'
import { useInstallerState } from '../../providers/InstallerProvider'

const AnimatedDiv = animated.div

function Screens() {
  const { step } = useInstallerState()

  const [prevStep, setPrevStep] = useState(-1)

  useEffect(() => {
    setPrevStep(step)
  }, [step])

  const direction = step > prevStep ? 1 : -1
  const { Screen, title } = InstallerScreens[step]

  return (
    <Transition
      native
      reset
      unique
      items={{ step, Screen }}
      keys={({ step }) => step}
      from={{
        opacity: 0,
        position: 'absolute',
        transform: `translate3d(${10 * direction}%, 0, 0)`,
      }}
      enter={{
        opacity: 1,
        position: 'static',
        transform: `translate3d(0%, 0, 0)`,
      }}
      leave={{
        opacity: 0,
        position: 'absolute',
        transform: `translate3d(${-10 * direction}%, 0, 0)`,
      }}
      config={springs.smooth}
    >
      {({ Screen }) => ({ opacity, transform, position }) => (
        <AnimatedDiv
          style={{ opacity, transform, position }}
          css={`
            top: 0;
            left: 0;
            right: 0;
          `}
        >
          <div
            css={`
              margin-bottom: ${2 * GU}px;
            `}
          >
            <Screen title={title} />
          </div>
        </AnimatedDiv>
      )}
    </Transition>
  )
}

export default Screens
