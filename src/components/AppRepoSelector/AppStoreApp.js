import React, { useCallback } from 'react'
import { Button, GU, Tag, textStyle, useTheme } from '@aragon/ui'
import getAppHeader from './headers'

function AppStoreApp({ repo, onSelect, selected }) {
  const theme = useTheme()

  const handleAppSelected = useCallback(() => {
    onSelect(repo)
  }, [onSelect, repo])

  const headerSrc = getAppHeader(repo.id) || repo.iconSrc

  return (
    <div
      css={`
        background: ${theme.surface};
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid ${selected ? 'transparent' : theme.border};
        box-shadow: ${selected ? '0px 0px 6px 0px rgba(0, 0, 0, 0.2)' : '0'};
        transition: all 0.4s ease;
      `}
    >
      <div
        css={`
          background: url(${headerSrc});
          height: ${15 * GU}px;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          ${selected && 'transform: scale(1.1);'}

          transition: transform 0.4s ease;
        `}
      />
      <div
        css={`
          padding: ${3 * GU}px;
          height: ${25 * GU}px;
          display: grid;
          grid-template-rows: ${4 * GU}px auto ${6 * GU}px;
          grid-gap: ${0.5 * GU}px;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <h2
            css={`
              ${textStyle('title4')};
            `}
          >
            {repo.name}
          </h2>
          {repo.author && (
            <Tag
              css={`
                margin-left: ${1 * GU}px;
              `}
            >
              {repo.author}
            </Tag>
          )}
        </div>
        <p
          css={`
            color: ${theme.contentSecondary};
            line-height: ${22}px;
            height: ${22 * 3}px; // 22px * 3 = line-height * 3 lines
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            hyphens: auto;
            overflow-wrap: anywhere;
            word-break: break-word;
            overflow: hidden;
          `}
        >
          {repo.description}
        </p>

        {/* <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <span
            css={`
              margin-right: ${1 * GU}px;
            `}
          >
            Manage permissions
          </span>
          <Switch onChange={() => {}} disabled />
        </div> */}
        <Button
          label={selected ? 'Remove' : 'Select'}
          mode={selected ? 'negative' : 'normal'}
          onClick={handleAppSelected}
          wide
          css={`
            margin-top: ${1 * GU}px;
          `}
        />
      </div>
    </div>
  )
}

export default AppStoreApp
