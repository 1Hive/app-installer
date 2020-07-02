import React, { useCallback, useState } from 'react'
import {
  AppBadge,
  Box,
  Checkbox,
  Field,
  GU,
  Help,
  Info,
  isAddress,
  springs,
  Switch,
  TextInput,
} from '@aragon/ui'
import BN from 'bn.js'
import { Spring, animated } from 'react-spring/renderprops'
import { getDefaultToken } from '../../../helpers/tokens'
import Navigation from '../../Navigation'
import TokenSelector from '../../kit/TokenSelector/TokenSelector'
import { useNodeHeight } from '../../../hooks/useNodeHeight'
import {
  monthsToSeconds,
  secondsToMonths,
  multiplierToBase,
  multiplierFromBase,
} from '../../../utils/utils'

const DEFAULT_DENOMINATION_TOKEN = getDefaultToken()
const EMPTY_TOKEN = { data: { address: '' }, selectedIndex: -1 }

function validate(denominationToken, { vestingLength, vestingCliffLength }) {
  if (!denominationToken || !isAddress(denominationToken)) {
    return 'Denomination token not valid address.'
  }

  if (parseInt(vestingLength) < parseInt(vestingCliffLength)) {
    return 'Vesting cliff period must be less or equal than vesting period'
  }

  return null
}

function PayrollScreen({
  appLabel,
  data,
  dataKey,
  iconSrc,
  screenProps: { navigate, onBack, onNext },
}) {
  const screenData = data?.[dataKey]

  const [denominationToken, setDenominationToken] = useState(
    screenData?.denominationToken || EMPTY_TOKEN
  )
  const [equitySettings, setEquitySettings] = useState({
    equityMultiplier: screenData?.equityMultiplier || new BN(0),
    vestingLength: screenData?.vestingLength || 0,
    vestingCliffLength: screenData?.vestingCliffLength || 0,
    vestingRevokable: screenData?.vestingRevokable ?? true,
  })

  const [vestingEnabled, setVestingEnabled] = useState(
    screenData?.vestingLength > 0
  )
  const [error, setError] = useState(null)

  const [height, ref] = useNodeHeight()

  const handleDenominationTokenChange = useCallback(
    ({ token, selectedIndex }) => {
      setError(null)
      setDenominationToken({ data: token, selectedIndex })
    },
    []
  )

  const handleEquityMultiplierChange = useCallback(event => {
    const newEquityMultiplier = event.target.value
    setError(null)
    setEquitySettings(equitySettings => ({
      ...equitySettings,
      equityMultiplier: multiplierToBase(newEquityMultiplier),
    }))
  }, [])

  const handleVestingEnabledChange = useCallback(() => {
    setError(null)
    setVestingEnabled(enabled => !enabled)
  }, [])

  const handleVestingLengthChange = useCallback(event => {
    const newVestingLength = event.target.value
    setError(null)
    setEquitySettings(equitySettings => ({
      ...equitySettings,
      vestingLength: monthsToSeconds(newVestingLength),
    }))
  }, [])

  const handleVestingCliffLengthChange = useCallback(event => {
    const newVestingCliffLength = event.target.value
    setError(null)
    setEquitySettings(equitySettings => ({
      ...equitySettings,
      vestingCliffLength: monthsToSeconds(newVestingCliffLength),
    }))
  }, [])

  const handleVestingRevokableToggle = useCallback(() => {
    setError(null)
    setEquitySettings(equitySettings => ({
      ...equitySettings,
      vestingRevokable: !equitySettings.vestingRevokable,
    }))
  }, [])

  const handleNext = useCallback(() => {
    const error = validate(denominationToken.data.address, equitySettings)

    if (error) {
      return setError(error)
    }

    return onNext({ [dataKey]: { denominationToken, ...equitySettings } })
  }, [dataKey, denominationToken, equitySettings, onNext])

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
        <div
          css={`
            display: flex;
          `}
        >
          <Field
            label={
              <React.Fragment>
                Denomination token
                <Help hint="What is denomination token?">
                  <strong> Denomination token</strong> is the address of the
                  token used for salary accounting.
                </Help>
              </React.Fragment>
            }
            css={`
              width: 100%;
              margin-right: ${1 * GU}px;
            `}
          >
            {({ id }) => (
              <TokenSelector
                selectedIndex={denominationToken.selectedIndex}
                onChange={handleDenominationTokenChange}
                value={denominationToken.data.address}
                tokens={[DEFAULT_DENOMINATION_TOKEN]}
              />
            )}
          </Field>

          <Field
            label={
              <React.Fragment>
                Equity multiplier
                <Help hint="What is equity multiplier?">
                  <strong> Equity multiplier</strong> defines the rate for
                  equity tokens payment relative to the base currency amount.
                  E.g If an employee has a salary of 1000 DAI and the multiplier
                  is 4x then they can mint up to 4000 of the equity asset per
                  period.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <>
                <TextInput
                  value={multiplierFromBase(equitySettings.equityMultiplier)}
                  onChange={handleEquityMultiplierChange}
                  css={`
                    width: ${15 * GU}px;
                    margin-right: ${0.5 * GU}px;
                  `}
                />
                X
              </>
            )}
          </Field>
        </div>

        <Field
          label={
            <React.Fragment>
              Enable vestings
              <Help hint="">
                You can choose to have equity payments vested for a configured
                period of time.
              </Help>
            </React.Fragment>
          }
        >
          {({ id }) => (
            <Switch
              checked={vestingEnabled}
              onChange={handleVestingEnabledChange}
            />
          )}
        </Field>

        {vestingEnabled && (
          <Spring
            config={springs.smooth}
            from={{ height: `${0}px` }}
            to={{ height: `${height}px` }}
            native
          >
            {({ height }) => (
              <animated.div style={{ height }}>
                <div ref={ref}>
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    `}
                  >
                    <Field
                      label={
                        <React.Fragment>
                          Vesting period (Months)
                          <Help hint="What is vesting period?">
                            <strong> Vesting period</strong> is the time at
                            which tokens are fully vested.
                          </Help>
                        </React.Fragment>
                      }
                    >
                      {({ id }) => (
                        <TextInput
                          value={secondsToMonths(equitySettings.vestingLength)}
                          onChange={handleVestingLengthChange}
                        />
                      )}
                    </Field>

                    <Field
                      label={
                        <React.Fragment>
                          Vesting cliff period (Months)
                          <Help hint="What is vesting cliff period?">
                            <strong> Vesting cliff period</strong> is the time
                            at which initial portion of vested tokens are
                            transferable.
                          </Help>
                        </React.Fragment>
                      }
                    >
                      {({ id }) => (
                        <label>
                          <TextInput
                            value={secondsToMonths(
                              equitySettings.vestingCliffLength
                            )}
                            onChange={handleVestingCliffLengthChange}
                            step={1}
                            min={0}
                          />
                        </label>
                      )}
                    </Field>
                  </div>

                  <Field
                    label={
                      <React.Fragment>
                        Vesting revokable
                        <Help hint="What is vesting revokable?">
                          <strong> Vesting revokable</strong> indicates whether
                          vestings can be revoked. When a vesting is revoked,
                          all non vested tokens are transfered back to the
                          Tokens app.
                        </Help>
                      </React.Fragment>
                    }
                  >
                    {({ id }) => (
                      <>
                        <Checkbox
                          checked={equitySettings.vestingRevokable}
                          onChange={handleVestingRevokableToggle}
                        />{' '}
                        Revokable
                      </>
                    )}
                  </Field>
                </div>
              </animated.div>
            )}
          </Spring>
        )}
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
        These settings determine the token used for salary accounting as well as
        equity payment options. Employees will be able to choose payment in
        denomination token, equity tokens or a mix of both. Equity payments are
        a multiple of the base currency amount which is defined by the equity
        multiplier. Equity payments can also be vested by enabling vestings.
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

PayrollScreen.defaultProps = {
  appLabel: 'Payroll',
  dataKey: 'payroll',
}

export default PayrollScreen
