/* eslint prefer-arrow-callback: 0, func-names: 0 */
/* eslint no-unused-expressions: 0, chai-friendly/no-unused-expressions: 2 */

// General 3rd-party supporting test libs
import chai, { expect } from 'chai'
import chaiJestSnapshot from 'chai-jest-snapshot'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

// General 3rd-party supporting libs
import React from 'react'
import List, { ListItem, ListItemText } from 'material-ui/List'

// App React component under test
import App, { initialState } from './../../../../src/client/containers/App'

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
    // the following tests
    let appWrapper = null

    beforeEach('Setup Enzyme wrapper', function() {
      appWrapper = shallow(<App />)

      expect(appWrapper).to.not.be.null
      expect(appWrapper.exists()).to.be.true
    })

    it('Initial state', function() {
      expect(appWrapper.state()).to.equal(initialState)

      // We expect a list to be rendered without any elements in it since we shouldn't have any
      // honey badgers when we first mount
      expect(appWrapper.find(List).exists()).to.be.true
      expect(appWrapper.find(ListItem).exists()).to.be.false

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

      // We expect a list to be rendered with elements if we have any honey badgers to render
      expect(appWrapper.find(List).exists()).to.be.true
      expect(appWrapper.find(ListItemText).exists()).to.be.true

      expect(toJson(appWrapper)).to.matchSnapshot()
    })
  })
})
