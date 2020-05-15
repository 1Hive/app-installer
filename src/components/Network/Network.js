import React, { useCallback, useMemo } from 'react'
import { DropDown, GU, useTheme } from '@aragon/ui'
import { getAvailableNetworks } from '../../networks'
import { getDefaultChain, setDefaultChain } from '../../local-settings'

function Network({ compact }) {
  const theme = useTheme()
  const chainId = getDefaultChain()
  const networks = getAvailableNetworks()

  const index = useMemo(() => {
    const slectedIndex = networks.findIndex(
      network => chainId === network.chainId
    )

    return slectedIndex
  }, [chainId, networks])

  const handleNetworkChange = useCallback(
    index => {
      const network = networks[index]

      if (network.chainId !== chainId) {
        setDefaultChain(network.chainId)
        window.location.reload()
      }
    },
    [chainId, networks]
  )

  return (
    <div
      css={`
        margin-left: ${1 * GU}px;
      `}
    >
      <DropDown
        items={networks.map(({ name, type }) => {
          const color = type === 'main' ? theme.positive : theme.yellow

          return (
            <div
              css={`
                display: flex;
                align-items: center;
              `}
            >
              <div
                css={`
                  height: ${1 * GU}px;
                  width: ${1 * GU}px;
                  background: ${color};
                  border-radius: 50%;
                  margin-right: ${1 * GU}px;
                `}
              />
              {!compact && <span>{name}</span>}
            </div>
          )
        })}
        selected={index}
        onChange={handleNetworkChange}
      />
    </div>
  )
}

export default Network
