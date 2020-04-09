import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Checkbox, GU, useTheme } from '@aragon/ui'

function AppCard({ app, onAppSelected, selectable, selected = true }) {
  const theme = useTheme()

  const handleAppSelected = useCallback(
    selected => {
      onAppSelected(app.name, selected)
    },
    [app.name, onAppSelected]
  )

  return (
    <div>
      <AppContainer
        css={`
          background: ${selected ? theme.surface : theme.background};
        `}
        selected={selected}
      >
        <div
          css={`
            border-radius: ${1 * GU}px;
            display: flex;
            overflow: hidden;
            margin-bottom: ${1 * GU}px;
          `}
        >
          <img src={app.iconSrc} alt="" height={7 * GU} />
        </div>
        <span
          css={`
            margin-bottom: ${0.5 * GU}px;
          `}
        >
          {app.name}
        </span>
        {selectable && (
          <Checkbox checked={selected} onChange={handleAppSelected} />
        )}
      </AppContainer>
    </div>
  )
}

const AppContainer = styled.div`
  border-radius: 4px;
  box-shadow: ${({ selected }) =>
    selected ? `1px 1px 3px 0px rgba(0, 0, 0, 0.2)` : ''};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${3 * GU}px;
  transition: all 0.5s ease;
`

export default AppCard
