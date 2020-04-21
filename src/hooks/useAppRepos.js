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
      try {
        for (let index = 0; index < apps.length; index++) {
          const app = apps[index]
          const repo = await getApmRepo(
            app.appName,
            'latest',
            getNetworkType(),
            ethers
          )
          tempRepos.push({ ...repo, ...app })
        }

        if (!cancelled) {
          setRepos(tempRepos)
        }
      } catch (err) {
        console.error('Error fetching repos', err)
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
