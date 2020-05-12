import React from 'react'
import { GU, Layout, Main } from '@aragon/ui'
import Header from './components/Header/MainHeader'
import Screens from './components/Screens'
import { ScrollProvider } from './providers/ScrollProvider'
import { useWallet } from './providers/Wallet'
import EnableAccount from './EnableAccount'

function App() {
  const { account } = useWallet()

  return (
    <Main layout={false} scrollView={false}>
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
                  max-width: 50%;
                  position: relative;
                  overflow: hidden;
                  margin: 0 auto;
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
