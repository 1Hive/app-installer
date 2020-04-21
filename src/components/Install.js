import React, { useCallback } from 'react'
import useAvailableRepos from '../hooks/useAppRepos'

function Install() {
  const [error, setError] = useState(null)

  const [repos, loadingRepos] = useAvailableRepos()
  const selectedApps = useSelectedApps(selectedApps)

  const handleAppInstall = useCallback(() => {
    const selectedAppsForInstallation = repos.filter(repo =>
      selectedApps.includes(repo.name)
    )

    const error = validateDAO(dao.apps.installed, selectedAppsForInstallation)
    if (error) {
      return setError(error)
    }

    installApps(
      dao.address,
      [...dao.apps.default, ...dao.apps.installed],
      selectedAppsForInstallation,
      ethers
    )
  }, [dao, ethers, repos, selectedApps])
  return (
    <div>
      <Button label="Install" mode="strong" wide onClick={handleAppInstall} />
      {error && <Info mode="warning">{error}</Info>}
    </div>
  )
}

export default Install
