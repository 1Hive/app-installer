import { useEffect, useMemo, useState } from 'react'
import { useWallet } from '../providers/Wallet'

import { getIPFSPath } from '../utils'
import { getInstalledApps } from '../toolkit'
import { getNetworkType } from '../lib/web3-utils'

function useDaoApps(daoAddress) {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(false)
  const { ethers } = useWallet()

  useEffect(() => {
    let cancelled = false

    if (!daoAddress) {
      return setApps([])
    }

    const fetchDAOInstalledApps = async () => {
      setLoading(true)

      try {
        const installedApps = await getInstalledApps(
          daoAddress,
          getNetworkType(),
          ethers
        )

        if (!cancelled) {
          setApps(installedApps)
        }
      } catch (err) {
        console.error('Error fetching installed apps:', err)
      }
      if (!cancelled) {
        setLoading(false)
      }
    }

    fetchDAOInstalledApps()

    return () => {
      cancelled = true
    }
  }, [daoAddress, ethers])

  const internalApps = apps.filter(app => app.isAragonOsInternalApp)
  const daoApps = useMemo(
    () =>
      apps
        .filter(app => !app.isAragonOsInternalApp)
        .map(({ appName, content, icons, name, proxyAddress, roles }) => {
          const iconRelativePath = icons?.[0].src
          const iconSrc = iconRelativePath
            ? getIPFSPath(content.location, iconRelativePath)
            : ''

          return { appName, iconSrc, name, proxyAddress, roles }
        }),
    [apps]
  )

  return [{ apps: daoApps, internal: internalApps }, loading]
}

export default useDaoApps
