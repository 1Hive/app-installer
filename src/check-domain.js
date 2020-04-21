import { useState, useEffect, useMemo } from 'react'
import { resolveDaoAddressOrEnsDomain } from './lib/web3-utils'
import { useWallet } from './providers/Wallet'

const DOMAIN_CHECK = Symbol('DOMAIN_CHECK')
const DOMAIN_LOADING = Symbol('DOMAIN_LOADING')
const DOMAIN_ERROR = Symbol('DOMAIN_ERROR')
const DOMAIN_NONE = Symbol('DOMAIN_NONE')

function useResolveDomain(domain) {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const { ethers } = useWallet()

  useEffect(() => {
    setAddress('')
    setLoading(true)

    let cancelled = false

    if (!ethers) {
      return
    }

    const resolveDomain = async () => {
      try {
        const address = await resolveDaoAddressOrEnsDomain(domain, ethers)
        if (!cancelled) {
          setAddress(address)
          setLoading(false)
        }
      } catch (err) {
        // retry every second
        setTimeout(resolveDomain, 1000)
      }
    }

    // Only start checking after 300ms
    setTimeout(() => {
      if (!cancelled) {
        resolveDomain()
      }
    }, 300)

    return () => {
      cancelled = true
    }
  }, [domain, ethers])

  const domainStatus = useMemo(() => {
    if (!domain) {
      return DOMAIN_NONE
    }
    if (loading) {
      return DOMAIN_LOADING
    }
    return address ? DOMAIN_CHECK : DOMAIN_ERROR
  }, [address, domain, loading])

  return [address, domainStatus]
}

export {
  DOMAIN_CHECK,
  DOMAIN_ERROR,
  DOMAIN_LOADING,
  DOMAIN_NONE,
  useResolveDomain,
}
