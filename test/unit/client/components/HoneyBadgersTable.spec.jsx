/* eslint prefer-arrow-callback: 0, func-names: 0 */
/* eslint no-unused-expressions: 0, chai-friendly/no-unused-expressions: 2 */

// General 3rd-party supporting test libs
import chai, { expect } from 'chai'
import chaiJestSnapshot from 'chai-jest-snapshot'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

// General 3rd-party supporting libs
import React from 'react'
import { Grid, Table } from '@devexpress/dx-react-grid-material-ui'

// App React component under test
import HoneyBadgersTable from './../../../../src/client/components/HoneyBadgersTable'

// Supporting app code
import { initialState } from './../../../../src/client/containers/App'

// Configure Chai to work with Jest
chai.use(chaiJestSnapshot)

describe('React component test: <HoneyBadgersTable>', function() {
  beforeEach(
    'Configure chai-jest-snapshot for "Mocha configuration mode"',
    function() {
      chaiJestSnapshot.configureUsingMochaContext(this)
      chaiJestSnapshot.setFilename(`${__filename}.snap`)
    },
  )

  describe('Renders correctly for given application state:', function() {
    // Reference to an Enzyme shallow wrapper around our <HoneyBadgersTable> component that can be
    // used throughout the following tests. Ought to be set before each test is ran.
    let hbtWrapper = null

    beforeEach('Setup Enzyme wrapper', function() {
      // Pass in props to the <HoneyBadgersTable> component the same the <App> component does when
      // it renders it.
      hbtWrapper = shallow(
        <HoneyBadgersTable
          honeyBadgers={[...initialState.honeyBadgers.values()]}
        />,
      )

      expect(hbtWrapper).to.not.be.null
      expect(hbtWrapper.exists()).to.be.true
    })

    it('Initial props/state', function() {
      // Even though the props/state gets set initially in our 'before' hooks we explicitly set it
      // here to be clear of the props/state that we expect to test
      hbtWrapper.setProps({
        honeyBadgers: [...initialState.honeyBadgers.values()],
      })

      // Ensure that we render a <Grid> and <Table> even if there is no data
      expect(hbtWrapper.find(Grid).exists()).to.be.true
      expect(hbtWrapper.find(Table).exists()).to.be.true

      // We shouldn't have any rows since we have no honey badgers. Lets double check...
      expect(hbtWrapper.find(Grid).prop('rows')).to.be.empty

      expect(toJson(hbtWrapper)).to.matchSnapshot()
    })

    it('Rows rendered (honey badgers data w/o additional data)', function() {
      // Create data as if we have only issued our initial GraphQL query of 'topHoneyBadgers'
      const honeyBadgers = [{ ipAddress: '1.1.1.1', count: 987 }]

      hbtWrapper.setProps({ honeyBadgers })

      // We should have some rows since we have some honey badgers. Check and ensure that each row
      // specifies it is loading data where appropriate
      const rows = hbtWrapper.find(Grid).prop('rows')
      expect(rows.length).to.equal(honeyBadgers.length)

      // Verify that we correctly set the data in a row given a honey badger
      const honeyBadger = honeyBadgers[0]
      const row = rows[0]

      // This assertion is meant to remind us to update the following assertions. It will fail as
      // we add additional keys to the row data and don't update the tests. We currently expect
      // the following keys: 'ipAddress', 'count', 'country', 'asn'
      expect(Object.keys(row).length).to.equal(4)

      // Now check for the data we expect...
      expect(row.ipAddress).to.equal(honeyBadger.ipAddress)
      expect(parseInt(row.count, 10)).to.equal(honeyBadger.count)

      // This test presumes we haven't yet queried for other data yet so we expect any info we
      // from other data we would display to say 'Loading' at this point
      expect(row.country).to.equal('Loading')
      expect(row.asn).to.equal('Loading')

      expect(toJson(hbtWrapper)).to.matchSnapshot()
    })

    it('Rows rendered (honey badgers data w/ autonomous systems data)', function() {
      // Create data as if we have issued the 'topHoneyBadgers' and 'autonomousSystems' queries to
      // our GraphQL service/API endpoint
      const honeyBadgers = [
        {
          ipAddress: '1.1.1.1',
          count: 987,
          as: {
            name: 'OVH SAS',
            asn: 16276,
            countryCode: 'FR',
          },
        },
      ]

      hbtWrapper.setProps({ honeyBadgers })

      // We should have some rows since we have some honey badgers. Check and ensure that each row
      // specifies it is loading data where appropriate
      const rows = hbtWrapper.find(Grid).prop('rows')
      expect(rows.length).to.equal(honeyBadgers.length)

      // Verify that we correctly set the data in a row given a honey badger
      const honeyBadger = honeyBadgers[0]
      const row = rows[0]

      // This assertion is meant to remind us to update the following assertions. It will fail as
      // we add additional keys to the row data and don't update the tests. We currently expect
      // the following keys: 'ipAddress', 'count', 'country, 'asn'
      expect(Object.keys(row).length).to.equal(4)

      // Now check for the data we expect...
      expect(row.ipAddress).to.equal(honeyBadger.ipAddress)
      expect(parseInt(row.count, 10)).to.equal(honeyBadger.count)
      expect(parseInt(row.asn, 10)).to.equal(honeyBadger.as.asn)

      // This test presumes we haven't yet queried for geospatial locations data so we expect any
      // info we would display about that data to say 'Loading' at this point
      expect(row.country).to.equal('Loading')

      expect(toJson(hbtWrapper)).to.matchSnapshot()
    })

    it('Rows rendered (honey badgers data w/ AS and location data)', function() {
      // Create data as if we have issued the 'topHoneyBadgers', 'autonomousSystems', and
      // 'geoLocations' queries to our GraphQL service/API endpoint
      const honeyBadgers = [
        {
          ipAddress: '1.1.1.1',
          count: 987,
          geoLocation: {
            latitude: 47.6062,
            longitude: 122.3321,
            country: 'United State',
            continent: 'North America',
          },
          as: {
            name: 'OVH SAS',
            asn: 16276,
            countryCode: 'FR',
          },
        },
      ]

      hbtWrapper.setProps({ honeyBadgers })

      // We should have some rows since we have some honey badgers. Check and ensure that each row
      // specifies it is loading data where appropriate
      const rows = hbtWrapper.find(Grid).prop('rows')
      expect(rows.length).to.equal(honeyBadgers.length)

      // Verify that we correctly set the data in a row given a honey badger
      const honeyBadger = honeyBadgers[0]
      const row = rows[0]

      // This assertion is meant to remind us to update the following assertions. It will fail as
      // we add additional keys to the row data and don't update the tests. We currently expect
      // the following keys: 'ipAddress', 'count', 'country', 'asn'
      expect(Object.keys(row).length).to.equal(4)

      // Now check the data we expect...
      expect(row.ipAddress).to.equal(honeyBadger.ipAddress)
      expect(parseInt(row.count, 10)).to.equal(honeyBadger.count)
      expect(parseInt(row.asn, 10)).to.equal(honeyBadger.as.asn)
      expect(row.country).to.equal(honeyBadger.geoLocation.country)

      expect(toJson(hbtWrapper)).to.matchSnapshot()
    })
  })
})
