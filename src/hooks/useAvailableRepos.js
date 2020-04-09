import { useEffect, useMemo, useState } from 'react'
import { getApmRepo } from '../toolkit'
import apps from '../config/apps.json'
import { getIPFSPath } from '../utils'
import environment from '../environment'

function useAvailableRepos() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchRepos = async () => {
      if (apps.length === 0) {
        return
      }

      setLoading(true)
      const tempRepos = []
      try {
        for (let index = 0; index < apps.length; index++) {
          const app = apps[index]
          const repo = await getApmRepo(app.appName, 'latest', environment)
          tempRepos.push({ ...repo, ...app })
        }

        if (!cancelled) {
          setRepos(tempRepos)
        }
      } catch (err) {
        console.error('Error fetching repos')
      }
      if (!cancelled) {
        setLoading(false)
      }
    }

    fetchRepos()

    return () => {
      cancelled = true
    }
  }, [])

  const processedRepos = useMemo(() => {
    return repos.map(({ contentUri, icons, ...repo }) => {
      const iconRelativePath = icons[0].src
      const iconSrc = getIPFSPath(contentUri, iconRelativePath)

      return { ...repo, iconSrc }
    })
  }, [repos])

  return [processedRepos, loading]
}

export default useAvailableRepos
