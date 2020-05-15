import React, { useEffect, useMemo, useState } from 'react'
import { GU, springs } from '@aragon/ui'
import { Transition, animated } from 'react-spring/renderprops'
import { InstallerScreens } from './config'
import { useInstallerState } from '../../providers/InstallerProvider'

const AnimatedDiv = animated.div
const DEFAULT_SCREEN_WIDTH = 500

function Screens() {
  const [prevStep, setPrevStep] = useState(-1)
  const { configurableApps, step } = useInstallerState()

  const screens = useMemo(() => {
    const skipConfiguration = configurableApps.length === 0

    if (skipConfiguration) {
      // IF there's no configuration needed, then we'll skip app configuration and review configuration screens
      return [...InstallerScreens.slice(0, 3), ...InstallerScreens.slice(-1)]
    }

    return InstallerScreens
  }, [configurableApps])

  useEffect(() => {
    setPrevStep(step)
  }, [step])

  const direction = step > prevStep ? 1 : -1
  const { Screen, title, width } = screens[step]

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
        <div
          css={`
            overflow: hidden;
            position: relative;
            width: ${width === 'full-width'
              ? '100%'
              : `${DEFAULT_SCREEN_WIDTH}px`};
            max-width: 100%;
          `}
        >
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
        </div>
      )}
    </Transition>
  )
}

export default Screens
