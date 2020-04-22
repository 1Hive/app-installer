import React, { useCallback, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import ScrollView from '../components/ScrollView'

const ScrollContext = React.createContext()

function ScrollProvider({ children }) {
  const ref = useRef(null)

  const scrollTo = useCallback(target => {
    ref.current.scrollTo(0, target)
  }, [])

  return (
    <ScrollContext.Provider value={{ scrollTo }}>
      <ScrollView ref={ref}>{children}</ScrollView>
    </ScrollContext.Provider>
  )
}

ScrollProvider.propTypes = {
  children: PropTypes.node,
}

function useScroll() {
  return useContext(ScrollContext)
}

export { ScrollProvider, useScroll }
