import { useEffect, useMemo, useState } from 'react'
import { getInstalledApps } from '../toolkit/'
import { isAddress } from '@aragon/ui'
import { getIPFSPath } from '../utils'
import environment from '../environment'

function useDAO(daoAddress) {
  const [installedApps, setInstalledApps] = useState([])
  const [loading, setLoading] = useState(false)

  console.log('installed', installedApps)

  useEffect(() => {
    let cancelled = false

    if (!isAddress(daoAddress)) {
      return setInstalledApps([])
    }

    const fetchDAOInstalledApps = () => {
      setLoading(true)
      getInstalledApps(daoAddress, environment)
        .then(apps => {
          if (!cancelled) {
            setInstalledApps(apps)
          }
        })
        .catch(err => {
          console.error('Error fetching installed apps:', err)
        })
        .finally(() => {
          if (!cancelled) {
            setLoading(false)
          }
        })
    }

    fetchDAOInstalledApps()

    return () => {
      cancelled = true
    }
  }, [daoAddress])

  const defaultApps = installedApps.filter(app => app.isAragonOsInternalApp)
  const daoApps = useMemo(
    () =>
      installedApps
        .filter(app => !app.isAragonOsInternalApp)
        .map(({ appName, content, icons, name, proxyAddress }) => {
          const iconRelativePath = icons[0].src
          const iconSrc = getIPFSPath(content.location, iconRelativePath)

          return { appName, iconSrc, name, proxyAddress }
        }),
    [installedApps]
  )

  return [defaultApps, daoApps, loading]
}

export default useDAO
