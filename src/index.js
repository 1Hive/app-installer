import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { WalletProvider } from './providers/Wallet'
import { InstallerProvider } from './providers/InstallerProvider'
import { ThemeProvider } from './providers/ThemeProvider'

ReactDOM.render(
  <ThemeProvider>
    <WalletProvider>
      <InstallerProvider>
        <App />
      </InstallerProvider>
    </WalletProvider>
  </ThemeProvider>,
  document.getElementById('root')
)
