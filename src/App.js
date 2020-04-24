import React from 'react'
import { GU, Layout, Main } from '@aragon/ui'
import Header from './components/Header/MainHeader'
import Screens from './components/Screens'
import { ScrollProvider } from './providers/ScrollProvider'

function App() {
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
                  position: relative;
                  width: 50%;
                  margin: 0 auto;
                  overflow: hidden;
                `}
              >
                <Screens />
              </div>
            </div>
          </Layout>
        </ScrollProvider>
      </div>
    </Main>
  )
}

export default App
