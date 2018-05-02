/* eslint prefer-arrow-callback: 0, func-names: 0 */
/* eslint no-unused-expressions: 0, chai-friendly/no-unused-expressions: 2 */

// General 3rd-party supporting test libs
import chai, { expect } from 'chai'
import chaiJestSnapshot from 'chai-jest-snapshot'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

// General 3rd-party supporting libs
import React from 'react'

// App React component under test
import App, { initialState } from './../../../../src/client/containers/App'

// Supporting app code
import HoneyBadgersTable from './../../../../src/client/components/HoneyBadgersTable'

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
    // Reference to an Enzyme shallow wrapper around our <App> component that can be used throughout
    // the following tests. Ought to be set before each test is ran.
    let appWrapper = null

    beforeEach('Setup Enzyme wrapper', function() {
      appWrapper = shallow(<App />)

      expect(appWrapper).to.not.be.null
      expect(appWrapper.exists()).to.be.true
    })

    it('Initial props/state', function() {
      // Even though the props/state gets set initially in our 'before' hooks we explicitly set it
      // here to be clear of the props/state that we expect to test
      expect(appWrapper.state()).to.equal(initialState)
      expect(appWrapper.find(HoneyBadgersTable).exists()).to.be.true

      expect(toJson(appWrapper)).to.matchSnapshot()
    })

    it('Error (state contains empty list of honey badgers)', function() {
      const error = 'Bananas LOL'
      appWrapper.setState({ error })

      // If an error is set then we ought to render just the text error
      expect(appWrapper.text()).to.include(error)

      expect(toJson(appWrapper)).to.matchSnapshot()
    })

    it('Error (state contains non-empty list of honey badgers)', function() {
      const error = 'Bananas LOL'
      appWrapper.setState({ error, honeyBadgers: [{}] })

      // Even if we have some honey badgers in our list we ought to still render an error if one is
      // provided
      expect(appWrapper.text()).to.include(error)

      expect(toJson(appWrapper)).to.matchSnapshot()
    })

    it('Honey badgers (state contains non-empty list of honey badgers)', function() {
      appWrapper.setState({ honeyBadgers: [{}] })
      expect(appWrapper.find(HoneyBadgersTable).exists()).to.be.true

      expect(toJson(appWrapper)).to.matchSnapshot()
    })
  })
})
