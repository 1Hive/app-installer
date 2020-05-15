import React from 'react'
import { GU, Layout, Main } from '@aragon/ui'
import EnableAccount from './EnableAccount'
import Header from './components/Header/MainHeader'
import Screens from './components/Screens'

import { useWallet } from './providers/Wallet'
import { useAppTheme } from './providers/ThemeProvider'
import { ScrollProvider } from './providers/ScrollProvider'

function App() {
  const { account } = useWallet()
  const { appearance } = useAppTheme()

  return (
    <Main theme={appearance} layout={false} scrollView={false}>
      <div
        css={`
          height: 100vh;
        `}
      >
        <Header />
        <ScrollProvider>
          <Layout>
            <div
              css={`
                height: 100%;
                margin: ${6 * GU}px 0;
              `}
            >
              <div
                css={`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                `}
              >
                {account ? <Screens /> : <EnableAccount />}
              </div>
            </div>
          </Layout>
        </ScrollProvider>
      </div>
    </Main>
  )
}

export default App
