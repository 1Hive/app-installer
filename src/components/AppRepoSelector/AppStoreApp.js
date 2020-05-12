import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'

function AppStoreApp({ repo, onSelect, selected }) {
  const theme = useTheme()

  const handleAppSelected = useCallback(() => {
    onSelect(repo)
  }, [onSelect, repo])

  return (
    <Card
      css={`
        background: ${theme.surface};
      `}
    >
      <div
        css={`
          background: url(${repo.iconSrc});
          height: ${17 * GU}px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        `}
      />
      <div
        css={`
          padding: ${3 * GU}px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: ${28 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title4')};
          `}
        >
          {repo.name}
        </h2>
        <p
          css={`
            color: ${theme.contentSecondary};
            margin-top: ${1 * GU}px;
          `}
        >
          {repo.description}
        </p>
        <Button
          label={selected ? 'Remove' : 'Add'}
          mode={selected ? 'negative' : 'normal'}
          onClick={handleAppSelected}
          wide
          css={`
            margin-top: ${1 * GU}px;
          `}
        />
      </div>
    </Card>
  )
}

const Card = styled.div`
  border-radius: 4px;
  overflow: hidden;

  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
  cursor: pointer;
`

export default AppStoreApp
