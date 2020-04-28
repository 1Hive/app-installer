import React from 'react'
import { DataView, GU, LoadingRing } from '@aragon/ui'
import { useInstallerState } from '../../../providers/InstallerProvider'
import Navigation from '../../Navigation'
import Header from '../Header'

function ReviewDAOApps({ title }) {
  const { daoApps, loadingApps, onBack, onNext } = useInstallerState()

  return (
    <div>
      <Header title={title} />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        {loadingApps ? (
          <Loading text="Loading apps" />
        ) : (
          daoApps.length > 0 && (
            <DataView
              entries={daoApps.map(app => [
                { name: app.name, icon: app.iconSrc },
              ])}
              entriesPerPage={5}
              fields={['Installed apps']}
              mode="table"
              renderEntry={([app]) => [
                <div
                  css={`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <div
                    css={`
                      border-radius: ${0.5 * GU}px;
                      display: flex;
                      margin-right: ${0.5 * GU}px;
                      overflow: hidden;
                    `}
                  >
                    <img src={app.icon} height={3 * GU} />
                  </div>
                  <span>{app.name}</span>
                </div>,
              ]}
              tableRowHeight={6 * GU}
            />
          )
        )}
      </div>
      <Navigation nextEnabled={!loadingApps} onBack={onBack} onNext={onNext} />
    </div>
  )
}

const Loading = ({ text }) => {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        width: ${22 * GU}px;
        margin: 0 auto;
      `}
    >
      <LoadingRing
        css={`
          width: ${4 * GU}px;
        `}
      />
      <span>{text}</span>
    </div>
  )
}

export default ReviewDAOApps
