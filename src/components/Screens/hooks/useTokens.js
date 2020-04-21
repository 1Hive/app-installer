import { useCallback, useMemo, useState } from 'react'
import { addressesEqual, isAddress } from '@aragon/ui'

const EMPTY_TOKEN = { token: { address: '' }, selectedIndex: -1 }

function validationError(tokens) {
  if (tokens.length === 0) {
    return 'You need to select at least one redeemable token.'
  }

  const notValidAddress = tokens.some(({ token }) => !isAddress(token.address))

  if (notValidAddress) {
    return 'One or more selected tokens are not valid addresses.'
  }

  return null
}

function useTokens() {
  const [tokens, setTokens] = useState([EMPTY_TOKEN])
  const [error, setError] = useState(null)

  const handleTokenAdded = useCallback(() => {
    setError(null)
    setTokens(tokens => [...tokens, EMPTY_TOKEN])
  }, [])

  const handleTokenRemoved = useCallback(index => {
    setError(null)
    setTokens(tokens => tokens.filter((_, i) => i !== index))
  }, [])

  const handleTokenUpdated = useCallback(
    ({ token: newToken, selectedIndex: newSelectedIndex, componentIndex }) => {
      const duplicate = tokens.some(
        ({ token }, index) =>
          isAddress(newToken.address) &&
          index !== componentIndex &&
          addressesEqual(token.address, newToken.address)
      )

      if (duplicate) {
        setError('Token already selected')
        return
      }

      setError(null)

      setTokens(tokens =>
        tokens.map((item, i) =>
          i === componentIndex
            ? { token: newToken, selectedIndex: newSelectedIndex }
            : item
        )
      )
    },
    [tokens]
  )

  const actions = useMemo(
    () => ({
      add: handleTokenAdded,
      remove: handleTokenRemoved,
      update: handleTokenUpdated,
      validate: validationError,
    }),
    [handleTokenAdded, handleTokenRemoved, handleTokenUpdated]
  )

  return [tokens, actions, error]
}

export default useTokens
