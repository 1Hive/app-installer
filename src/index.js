import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { WalletProvider } from './providers/Wallet'
import { InstallerProvider } from './providers/InstallerProvider'

ReactDOM.render(
  <WalletProvider>
    <InstallerProvider>
      <App />
    </InstallerProvider>
  </WalletProvider>,
  document.getElementById('root')
)
