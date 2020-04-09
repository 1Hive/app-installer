import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import useRepos from '../hooks/useAvailableRepos'

const AppsRepoContext = React.createContext()

function AppsRepoProvider({ children }) {
  const [repos, loading] = useRepos()

  console.log('repos', repos)

  return (
    <AppsRepoContext.Provider value={{ repos, loading }}>
      {children}
    </AppsRepoContext.Provider>
  )
}

AppsRepoProvider.propTypes = {
  children: PropTypes.node,
}

function useAppsRepos() {
  return useContext(AppsRepoContext)
}

export { AppsRepoProvider, useAppsRepos }
