import React, { useContext, useMemo } from 'react'
import { providers as EthersProviders } from 'ethers'
import { UseWalletProvider, useWallet } from 'use-wallet'
import { getUseWalletConnectors } from '../lib/web3-utils'
import env from '../environment'
import { getNetwork } from '../networks'

const WalletAugmentedContext = React.createContext()

function useWalletAugmented() {
  return useContext(WalletAugmentedContext)
}

// Adds Ethers.js to the useWallet() object
function WalletAugmented({ children }) {
  const wallet = useWallet()
  const { ethereum } = wallet

  const ethers = useMemo(() => {
    if (!ethereum) {
      return null
    }

    const ensRegistry = getNetwork().ensRegistry
    return new EthersProviders.Web3Provider(ethereum, {
      name: '',
      chainId: env('CHAIN_ID'),
      ensAddress: ensRegistry,
    })
  }, [ethereum])

  const contextValue = useMemo(() => ({ ...wallet, ethers }), [wallet, ethers])

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  )
}

function WalletProvider({ children }) {
  return (
    <UseWalletProvider
      chainId={env('CHAIN_ID')}
      connectors={getUseWalletConnectors()}
    >
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  )
}

export { useWalletAugmented as useWallet, WalletProvider }
