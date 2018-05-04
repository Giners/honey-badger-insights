import React from 'react'
import PropTypes from 'prop-types'

import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid'

import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui'

/**
 * Takes a list of honey badgers and their details and turns it into rows of details for use in the
 * table that displays the details about honey badgers. It presumes that at a minimum that the
 * IP address ('ipAddress') and the amount of times the honey badger has been seen in the last 24
 * hours ('count') are present on the details.
 */
const getHoneyBadgersRows = honeyBadgers =>
  honeyBadgers.map(honeyBadger => {
    // Supply the minimum amount of info we expect in a row which is the IP address and the amount
    // of times we have seen the entity in the last 24 hours. Add a 'Loading' flag as the default
    // for all of the other info that may not be loaded yet.
    const { ipAddress, count, geoLocation, as } = honeyBadger

    const row = {
      ipAddress,
      count,
      country: 'Loading',
      asn: 'Loading',
    }

    // Add the additional info if it has been loaded:
    // * Autonomous system number if autonomous system info has been loaded
    // * Country of origin if geospatial location info has been loaded
    if (geoLocation) {
      row.country = geoLocation.country
    }

    if (as) {
      row.asn = as.asn
    }

    return row
  })

const HoneyBadgersTable = ({ honeyBadgers }) => (
  <Grid
    rows={getHoneyBadgersRows(honeyBadgers)}
    columns={[
      { name: 'ipAddress', title: 'IP Address' },
      { name: 'count', title: 'Times Seen Last 24 Hours' },
      { name: 'country', title: 'Country of Origin' },
      { name: 'asn', title: 'Autonomous System #' },
    ]}
  >
    <PagingState defaultCurrentPage={0} pageSize={5} />
    <IntegratedPaging />
    <Table />
    <TableHeaderRow />
    <PagingPanel />
  </Grid>
)

HoneyBadgersTable.propTypes = {
  honeyBadgers: PropTypes.arrayOf(
    PropTypes.shape({
      ipAddress: PropTypes.string,
      count: PropTypes.number,
    }),
  ).isRequired,
}

export default HoneyBadgersTable
