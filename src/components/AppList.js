import React from 'react'
import { DataView, GU } from '@aragon/ui'
import styled from 'styled-components'
import AppCard from './AppCard'

function AppList({ apps, mode, onAppSelected, selectable = false, selected }) {
  return (
    <div>
      {mode === 'table' ? (
        apps.length > 0 && (
          <DataView
            entries={apps.map(app => [{ name: app.name, icon: app.iconSrc }])}
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
      ) : (
        <Container>
          {apps.map((app, index) => (
            <AppCard
              key={index}
              app={app}
              onAppSelected={onAppSelected}
              selectable={selectable}
              selected={selected?.some(elem => elem === app.name)}
            />
          ))}
        </Container>
      )}
    </div>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: ${21 * GU}px;
  grid-gap: ${2 * GU}px;
`

export default AppList
