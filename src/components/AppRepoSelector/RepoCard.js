import React, { useCallback } from 'react'
import { Checkbox, GU, textStyle, useTheme } from '@aragon/ui'

function RepoCard({ repo, onRepoSelected, selected = true }) {
  const theme = useTheme()

  const handleAppSelected = useCallback(() => {
    onRepoSelected(repo.appName)
  }, [onRepoSelected, repo])

  return (
    <div
      css={`
        background: ${selected ? theme.surface : theme.background};
        box-shadow: ${selected ? `0px 1px 2px 0px rgba(0, 0, 0, 0.2)` : ''};
        border: 1px solid ${selected ? 'transparent' : theme.border.alpha(0.6)};
        border-radius: 6px;
        display: flex;
        align-items: center;
        padding: ${3 * GU}px;
        transition: all 0.4s ease;
        cursor: pointer;

        ${!selected &&
          `
            &:hover {
              border-color: ${theme.border};
            }
          `}
      `}
      onClick={handleAppSelected}
    >
      <div
        css={`
          width: ${7 * GU}px;
        `}
      >
        <div
          css={`
            display: flex;
            border-radius: ${1 * GU}px;
            margin-bottom: ${1 * GU}px;
            overflow: hidden;
          `}
        >
          <img src={repo.iconSrc} alt="" height={7 * GU} />
        </div>
      </div>
      <div
        css={`
          margin: 0 ${3 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title4')};
            margin-bottom: ${0.5 * GU}px;
          `}
        >
          {repo.name}
        </h2>
        <p>{repo.description}</p>
      </div>
      <div>
        <Checkbox checked={selected} />
      </div>
    </div>
  )
}

export default RepoCard
