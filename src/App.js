import React from 'react'
import { GU, Layout, Main, ScrollView } from '@aragon/ui'

import Header from './components/Header/Header'
import Screens from './components/Screens'

function App() {
  return (
    <Main layout={false} scrollView={false}>
      <div
        css={`
          height: 100vh;
        `}
      >
        <Header />
        <ScrollView>
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
        </ScrollView>
      </div>
    </Main>
  )
}

export default App
