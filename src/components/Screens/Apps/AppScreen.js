import React from 'react'
import { useTheme } from '@aragon/ui'

const AppScreen = React.forwardRef(function AppScreen(
  { blurr, children },
  ref
) {
  const theme = useTheme()

  return (
    <div
      ref={ref}
      css={`
        position: relative;
      `}
    >
      <div>{children}</div>
      {blurr && (
        <div
          css={`
            position: absolute;
            opacity: 0.9;
            background: ${theme.background};
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          `}
        />
      )}
    </div>
  )
})

export default AppScreen
