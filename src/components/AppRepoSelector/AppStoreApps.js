import React from 'react'
import { animated, useTransition } from 'react-spring'
import { GU } from '@aragon/ui'
import AppStoreApp from './AppStoreApp'

function AppStoreApps({ repos, onSelect, selected }) {
  const transitions = useTransition(repos, (_, index) => index, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    trail: 100,
  })

  return (
    <div
      css={`
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(267px, 1fr));
        grid-gap: ${1.5 * GU}px;
        margin-bottom: ${2 * GU}px;
      `}
    >
      {transitions.map(({ item, key, props }) => {
        const isSelected = selected?.some(elem => elem.appName === item.appName)

        return (
          <animated.div key={key} style={props}>
            <AppStoreApp
              onSelect={onSelect}
              repo={item}
              selected={isSelected}
            />
          </animated.div>
        )
      })}
    </div>
  )
}

export default AppStoreApps
