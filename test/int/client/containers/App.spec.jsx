/* eslint prefer-arrow-callback: 0, func-names: 0 */
/* eslint no-unused-expressions: 0, chai-friendly/no-unused-expressions: 2 */

// General 3rd-party supporting test libs
import { expect } from 'chai'
import { mount } from 'enzyme'
import waitUntil from 'async-wait-until'

// General 3rd-party supporting libs
import React from 'react'

// App React component under test
import App from './../../../../src/client/containers/App'

// Supporting app code
import config from './../../../../src/server/config'
import honeyBadgerApp from './../../../../src/server/honeyBadgerApp'
import HoneyBadgersTable from './../../../../src/client/components/HoneyBadgersTable'

describe('React component test: <App>', function() {
  // Reference to our server we use to test the integration of the <App> component with our
  // backend. Needs to be cleaned up when the tests end.
  let testServer = null

  before('Setup test server with GraphQL API service/endpoint', function(done) {
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

  describe('Renders correctly for given application state:', function() {
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

          return appWrapper.state('honeyBadgers').size > 0
        },
        15000,
        500,
      )

      // Force a re-render since we are updating our state out-of-band in regards to this test (i.e.
      // <App> makes async calls to our backend to get the honey badgers)
      appWrapper.update()

      const totalHoneyBadgers = appWrapper.state('honeyBadgers').size

      // Check that we got some honey badgers and that we have rendered the appropriate amount
      expect(totalHoneyBadgers).to.be.above(0)
      expect(appWrapper.find(HoneyBadgersTable).exists()).to.be.true

      // If we passed the assertions above set the state to have one honey badger with the same IP
      // address before we snapshot our component. That is because the above assertions are against
      // dynamic data returned by our server which would cause future snapshot assertions to fail,
      // well because, they data is dynamic and is always changing.
      const honeyBadgers = new Map([
        ['1.1.1.1', { ipAddress: '1.1.1.1', count: 987 }],
      ])
      appWrapper.setState({ honeyBadgers })
    })
  })

  describe('collectTopHoneyBadgersInfo():', function() {
    it('Promise resolves to map with honey badgers info', async function() {
      const honeyBadgers = await App.collectTopHoneyBadgersInfo()

      // Check that we correctly populated our keys on our map... Something is going on that is
      // weird where I can't convert the array like object into an object to use 'forEach'. Thus I
      // just iterate over it using a good old for loop.
      const keys = [...honeyBadgers.keys()]
      for (let i = 0; i < keys.length; i += 1) {
        expect(keys[i]).to.be.a('string')
        expect(keys[i]).to.not.be.empty
      }

      // Check that we correctly populated our entries on our map...
      ;[...honeyBadgers.values()].forEach(value => {
        expect(value).to.be.an('object')
        expect(value.ipAddress).to.be.a('string')
        expect(value.ipAddress).to.not.be.empty
        expect(value.count).to.be.a('number')
        expect(value.count).to.be.above(0)
      })
    })
  })

  describe('collectAutonomousSystemsInfo():', function() {
    it('Promise resolves to map with autonomous systems info injected', async function() {
      // First query for honey badgers so we can pass them to the
      // 'App.collectAutnomousSystemsInfo()' method...
      const honeyBadgers = await App.collectTopHoneyBadgersInfo()

      // Now query for autonomous systems info and check that the map of honey badgers has been
      // updated inline with the invocation of the 'App.collectAutonomousSystemsInfo()' method...
      const promise = App.collectAutonomousSystemsInfo(honeyBadgers)

      // So weird... I would have liked to await the call to 'App.collectAutonomousSystemsInfo' but
      // was getting errors like 'TypeError: _App.default.collectAutonomousSystemsInfo(...)'. This
      // confused me since we are able to do this with 'App.collectTopHoneyBadgersInfo()'. I tried
      // to resolve it with some Babel plugins (plugin-transform-async-to-generator and
      // plugin-transform-runtime) but they didn't work. In the future if there is more time we
      // ought to revisit this problem and solve it so we can learn from it.
      return promise.then(() => {
        // Check that we correctly populated our entries on our map...
        ;[...honeyBadgers.values()].forEach(value => {
          expect(value).to.be.an('object')
          expect(value.as).to.be.an('object')
          expect(value.as.name).to.be.a('string')
          expect(value.as.name).to.not.be.empty
          expect(value.as.asn).to.be.a('number')
          expect(value.as.asn).to.be.above(0)
          expect(value.as.countryCode).to.be.a('string')
          expect(value.as.countryCode).to.not.be.empty
        })
      })
    })
  })
})
