import React from 'react'
import { DataView, GU } from '@aragon/ui'
import { useInstallerState } from '../../providers/InstallerProvider'
import Navigation from '../Screens/Navigation'

function DaoApps() {
  const { daoApps } = useInstallerState()

  return (
    <div>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        {daoApps.length > 0 && (
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
        )}
      </div>
      <Navigation />
    </div>
  )
}

export default DaoApps
