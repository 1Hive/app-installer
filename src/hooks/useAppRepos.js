import { useEffect, useMemo, useState } from 'react'
import { getApmRepo } from '../toolkit'
import apps from '../config/apps.json'
import { getIPFSPath } from '../utils'
import { getNetworkType } from '../lib/web3-utils'
import { useWallet } from '../providers/Wallet'

// Hook for fetching apps available for installation apm repos (see apps.json)
function useAppRepos() {
  const [repos, setRepos] = useState([])
  const { ethers } = useWallet()

  useEffect(() => {
    let cancelled = false

    const fetchRepos = async () => {
      if (!ethers || apps.length === 0) {
        return
      }

      const tempRepos = []
      for (let index = 0; index < apps.length; index++) {
        try {
          const app = apps[index]

          let repo

          // If there are multiple published apps, find the first one.
          // TODO: Support installing of all different versions.
          if (Array.isArray(app.appName)) {
            for (const appName of app.appName) {
              try {
                repo = await getApmRepo(
                  appName,
                  'latest',
                  getNetworkType(),
                  ethers
                )
              } catch (err) {
                console.log(`Repo for ${appName} not found`)
              }
            }
            if (!repo) {
              throw new Error('Could not find repo for any of ', app.appName)
            }
          } else {
            repo = await getApmRepo(
              app.appName,
              'latest',
              getNetworkType(),
              ethers
            )
          }

          tempRepos.push({ ...repo, ...app })
        } catch (err) {
          console.error('Error fetching repo', err)
        }
      }
      if (!cancelled) {
        setRepos(tempRepos)
      }
    }

    fetchRepos()

    return () => {
      cancelled = true
    }
  }, [ethers])

  const processedRepos = useMemo(() => {
    return repos.map(({ contentUri, icons, ...repo }) => {
      const iconRelativePath = icons[0].src
      const iconSrc = getIPFSPath(contentUri, iconRelativePath)

      return { ...repo, iconSrc }
    })
  }, [repos])

  return processedRepos
}

export default useAppRepos
