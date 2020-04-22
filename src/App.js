import React from 'react'
import { GU, Layout, Main } from '@aragon/ui'

import Header from './components/Header/Header'
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
              `}
            >
              <div
                css={`
                  padding: ${10 * GU}px 0;
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
