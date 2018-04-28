/* eslint prefer-arrow-callback: 0, func-names: 0 */
/* eslint no-unused-expressions: 0, chai-friendly/no-unused-expressions: 2 */

// General 3rd-party supporting test libs
import chai, { expect } from 'chai'
import chaiJestSnapshot from 'chai-jest-snapshot'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import waitUntil from 'async-wait-until'

// General 3rd-party supporting libs
import React from 'react'
import List, { ListItemText } from 'material-ui/List'

// App React component under test
import App from './../../../../src/client/containers/App'

// Supporting app code
import honeyBadgerApp from './../../../../src/server/honeyBadgerApp'
import config from './../../../../src/server/config'

// Configure Chai to work with Jest
chai.use(chaiJestSnapshot)

describe('React component test: <App>', function() {
  beforeEach(
    'Configure chai-jest-snapshot for "Mocha configuration mode"',
    function() {
      chaiJestSnapshot.configureUsingMochaContext(this)
      chaiJestSnapshot.setFilename(`${__filename}.snap`)
    },
  )

  describe('Renders correctly for given application state:', function() {
    // Reference to our server we use to test the integration of the <App> component with our
    // backend. Needs to be cleaned up when the tests end.
    let testServer = null

    before('Setup test server with GraphQL API service/endpoint', function(
      done,
    ) {
      testServer = honeyBadgerApp.listen(config.app.port, () => {
        expect(testServer).to.not.be.null

        done()
      })
    })

    after('Cleanup test server with GraphQL API service/endpoint', function(
      done,
    ) {
      testServer.close(() => {
        done()
      })
    })

    it('Honey badgers after querying the GraphQL API endpoint', async function() {
      // Increase the timeout in our integration test since we are ultimately making async calls to
      // HoneyDB
      this.timeout(15000)
      const appWrapper = mount(<App />)
      expect(appWrapper).to.not.be.null
      expect(appWrapper.exists()).to.be.true

      await waitUntil(
        () => {
          if (appWrapper.state('error') != null) {
            throw new Error(appWrapper.state('error'))
          }

          return appWrapper.state('honeyBadgers').length > 0
        },
        10000,
        500,
      )

      // Force a re-render since we are updating our state out-of-band in regards to this test (i.e.
      // <App> makes async calls to our backend to get the honey badgers)
      appWrapper.update()

      const totalHoneyBadgers = appWrapper.state('honeyBadgers').length

      // Check that we got some honey badgers and that we have rendered the appropriate amount
      expect(totalHoneyBadgers).to.be.above(0)
      expect(appWrapper.find(List).exists()).to.be.true
      expect(appWrapper.find(ListItemText).exists()).to.be.true
      expect(appWrapper.find(ListItemText)).to.have.length(totalHoneyBadgers)

      // If we passed the assertions above set the state to have one honey badger with the same IP
      // address before we snapshot our component. That is because the above assertions are against
      // dynamic data returned by our server which would cause future snapshot assertions to fail,
      // well because, they data is dynamic and is always changing.
      appWrapper.setState({ honeyBadgers: [{ ipAddress: '1.1.1.1' }] })

      expect(toJson(appWrapper)).to.matchSnapshot()
    })
  })
})
