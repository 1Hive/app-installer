import { useState, useEffect } from 'react'
import { getInstalledApps } from '@aragon/toolkit'
 
function useDAO(daoAddress) {
  const [installedApps, setInstalledApps] = useState([])

  useEffect(() => {
    let cancelled = false

    const fetchDAOInstalledApps = async () => {
      try {
        const apps = await getInstalledApps(daoAddress)

        if (!cancelled) {
          setInstalledApps(apps)
        }
      } catch (err) {
        console.error('Error fetching installed apps:', err)
      }
    }

    fetchDAOInstalledApps()

    return () => {
      cancelled = true
    }
  }, [daoAddress])

  return installedApps
}

export default useDAO
