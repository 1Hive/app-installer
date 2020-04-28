import React, { useCallback, useRef, useState } from 'react'
import { GU } from '@aragon/ui'
import { AppConfigScreens } from './config'
import { useInstallerState } from '../../providers/InstallerProvider'
import { useScroll } from '../../providers/ScrollProvider'
import Header from './Header'

function AppConfiguration({ title }) {
  const {
    appsConfig,
    configurableApps,
    onBack,
    onNext,
    onUpdateAppsConfig,
  } = useInstallerState()
  const { scrollTo } = useScroll()

  const [step, setStep] = useState(0)
  // TODO: Update appsConfig data if repo unselected
  const [screensData, setScreensData] = useState(appsConfig)

  const prevRef = useRef()
  const nextRef = useRef()

  const updateScreensData = useCallback(updatedData => {
    setScreensData(updatedData)
  }, [])

  const handlePrevStep = useCallback(() => {
    if (step === 0) {
      return onBack()
    }

    // Scroll to prev screen
    if (prevRef.current) {
      scrollTo(prevRef.current)
    }

    setStep(step => step - 1)
  }, [onBack, scrollTo, step])

  const handleNextStep = useCallback(
    screenData => {
      const updatedData = { ...screensData, ...screenData }

      // Save screensData and go to next installer screen
      if (step === configurableApps.length - 1) {
        onUpdateAppsConfig(updatedData)
        return onNext()
      }

      // Scroll to next screen
      if (nextRef.current) {
        const { offsetTop, offsetHeight } = nextRef.current
        scrollTo(offsetTop + offsetHeight)
      }

      // Go to next app configuration screen
      updateScreensData(updatedData)
      setStep(step => step + 1)
    },
    [
      configurableApps,
      onNext,
      onUpdateAppsConfig,
      screensData,
      scrollTo,
      step,
      updateScreensData,
    ]
  )

  return (
    <div>
      <Header title={title} />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        {configurableApps.map(({ iconSrc, id }, index) => {
          const { Screen } = AppConfigScreens.get(id)

          //  TODO: Generalize component
          return (
            <Screen
              ref={
                index === step + 1
                  ? nextRef
                  : index === step - 1
                  ? prevRef
                  : null
              }
              key={index}
              blurr={step !== index}
              data={screensData}
              iconSrc={iconSrc}
              screenProps={{
                navigate: index === step,
                onBack: handlePrevStep,
                onNext: handleNextStep,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AppConfiguration
