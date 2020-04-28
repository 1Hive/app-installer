import React from 'react'

const AppScreen = React.forwardRef(function AppScreen(
  { blurr, children },
  ref
) {
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
            background: #f9fafc;
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
