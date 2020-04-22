import React from 'react'
import PropTypes from 'prop-types'

const ScrollView = React.forwardRef(function ScrollView(
  { children, horizontal, vertical, ...props },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      css={`
        position: relative;
        scroll-behavior: smooth;
        // z-index: 0 to make sure everything outside of
        // ScrollView gets rendered above it by default.
        z-index: 0;
        height: 100%;
        overflow-x: ${horizontal ? 'auto' : 'hidden'};
        overflow-y: ${vertical ? 'auto' : 'hidden'};
      `}
    >
      {children}
    </div>
  )
})

ScrollView.propTypes = {
  vertical: PropTypes.bool,
  horizontal: PropTypes.bool,
  children: PropTypes.node,
}

ScrollView.defaultProps = {
  vertical: true,
  horizontal: true,
}

export default ScrollView
