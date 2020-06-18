import React, { useCallback, useState } from 'react'
import { AppBadge, Box, GU, Help, Info } from '@aragon/ui'
import Navigation from '../../Navigation'
import Duration from '../../kit/Duration'
import { DAY_IN_SECONDS, MINUTE_IN_SECONDS } from '../../kit/utils'

const DEFAULT_DURATION = DAY_IN_SECONDS

function validate(executionDelay) {
  if (executionDelay < 1 * MINUTE_IN_SECONDS) {
    return 'Please ensure the execution delay is equal to or longer than 1 minute.'
  }
  return null
}

function DelayScreen({
  appLabel,
  data,
  dataKey,
  iconSrc,
  screenProps: { navigate, onBack, onNext },
}) {
  const screenData = data?.[dataKey]
  const [error, setError] = useState(null)

  const [executionDelay, setExecutionDelay] = useState(
    screenData?.executionDelay || DEFAULT_DURATION
  )

  const handleExecutionDelayChange = useCallback(value => {
    setError(null)
    setExecutionDelay(value)
  }, [])

  const handleNext = useCallback(() => {
    const error = validate(executionDelay)

    if (error) {
      return setError(error)
    }

    return onNext({ [dataKey]: { executionDelay } })
  }, [dataKey, onNext, executionDelay])

  return (
    <Box padding={4 * GU}>
      <div
        css={`
          margin-bottom: ${5 * GU}px;
        `}
      >
        <span
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          Choose your
          <span
            css={`
              display: flex;
              margin: 0 ${1.5 * GU}px;
            `}
          >
            <AppBadge badgeOnly iconSrc={iconSrc} label={appLabel} />
          </span>
          settings.
        </span>
      </div>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Duration
          duration={executionDelay}
          onUpdate={handleExecutionDelayChange}
          label={
            <React.Fragment>
              Execution delay
              <Help hint="What's the execution delay?">
                <strong>Execution delay</strong> is the default length that a
                user will have to wait to execute a delayed action, provided it
                is not paused at some point during the delay.
              </Help>
            </React.Fragment>
          }
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

      <Info>
        These settings determine the duration in which the execution of actions
        is delayed.
      </Info>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        {navigate && (
          <Navigation
            backEnabled={Boolean(onBack)}
            onNext={handleNext}
            onBack={onBack}
          />
        )}
      </div>
    </Box>
  )
}

DelayScreen.defaultProps = {
  appLabel: 'Delay',
  dataKey: 'delay',
}

export default DelayScreen
