import React, { useCallback, useMemo } from 'react'
import { Accordion, AppBadge, GU, textStyle, useTheme } from '@aragon/ui'
import { useInstallerState } from '../../providers/InstallerProvider'
import Navigation from '../Navigation'
import { AppConfigScreens } from './config'
import Header from './Header'

function ReviewScreen({ title }) {
  const theme = useTheme()
  const {
    appsConfig,
    onBack,
    onNext,
    onUpdateAppsSettings,
    selectedAppRepos,
  } = useInstallerState()

  const handleInstall = useCallback(() => {
    const processedSettings = selectedAppRepos.reduce((acc, { id }) => {
      const { processData } = AppConfigScreens.get(id)

      const data = appsConfig[id]
      if (!data) {
        return acc
      }

      return {
        ...acc,
        [id]: typeof processData === 'function' ? processData(data) : data,
      }
    }, {})

    onUpdateAppsSettings(processedSettings)
    onNext()
  }, [appsConfig, onNext, onUpdateAppsSettings, selectedAppRepos])

  const items = useMemo(
    () =>
      selectedAppRepos.map(({ iconSrc, id }) => {
        const { appLabel, formatReviewFields } = AppConfigScreens.get(id)

        return [
          <AppBadge badgeOnly iconSrc={iconSrc} label={appLabel} />,
          formatReviewFields(appsConfig[id]),
        ]
      }),
    [appsConfig, selectedAppRepos]
  )

  return (
    <div>
      <Header title={title} />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Accordion
          items={items.map(([label, fields]) => [
            label,
            Array.isArray(fields) ? (
              <div
                css={`
                  padding: ${5 * GU}px;
                `}
              >
                {fields.map(([label, content]) => (
                  <section
                    key={label}
                    css={`
                      & + & {
                        margin-top: ${3 * GU}px;
                      }
                    `}
                  >
                    <h1
                      css={`
                        margin-bottom: ${1 * GU}px;
                        color: ${theme.contentSecondary};
                        ${textStyle('label2')};
                      `}
                    >
                      {label}
                    </h1>
                    <div
                      css={`
                        ${textStyle('body1')};
                      `}
                    >
                      {content}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              fields
            ),
          ])}
        />
      </div>
      <Navigation
        nextLabel="Install apps!"
        onBack={onBack}
        onNext={handleInstall}
      />
    </div>
  )
}

export default ReviewScreen
