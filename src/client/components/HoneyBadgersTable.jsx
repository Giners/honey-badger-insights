import React from 'react'
import PropTypes from 'prop-types'

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import Typography from 'material-ui/Typography'

import {
  PagingState,
  IntegratedPaging,
  RowDetailState,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid'

import {
  Grid,
  Table,
  TableHeaderRow,
  TableRowDetail,
  PagingPanel,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui'

import HoneyBadgerDetails from './HoneyBadgerDetails'

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
    const { ipAddress, count, geoLocation, as, blacklists } = honeyBadger

    const row = {
      ipAddress,
      count,
      country: 'Loading',
      asn: 'Loading',
      blacklisted: 'Loading',
    }

    // Add the additional info if it has been loaded:
    // * Autonomous system number if autonomous system info has been loaded
    // * Country of origin if geospatial location info has been loaded
    // * Whether the honey badger has been blacklisted if the blacklists info has been loaded
    if (geoLocation) {
      row.country = geoLocation.country
    }

    if (as) {
      row.asn = as.asn
    }

    if (blacklists) {
      row.blacklisted =
        blacklists.length > 0 ? 'BLACKLISTED' : 'Not in any blacklists'
    }

    return row
  })

const HoneyBadgersTable = ({ honeyBadgers }) => {
  const renderHoneyBadgerDetails = ({ row: { ipAddress } }) => (
    <HoneyBadgerDetails honeyBadger={honeyBadgers.get(ipAddress)} />
  )

  renderHoneyBadgerDetails.propTypes = {
    row: PropTypes.shape({
      ipAddress: PropTypes.string.isRequired,
    }).isRequired,
  }

  return (
    <div>
      <Typography paragraph>
        Top honey badger activity in the last 24 hours. Click the{' '}
        <KeyboardArrowRightIcon /> to see a profile for a specific honey badger.
        You can search/filter for specific honey badgers in the top right of the
        data table. Note that it may take a while for the data to load where you
        will see a &#39;No Data&#39; message. To learn more about the Honey
        Badger Insights app click the about tab above.
      </Typography>
      <Grid
        rows={getHoneyBadgersRows([...honeyBadgers.values()])}
        columns={[
          { name: 'ipAddress', title: 'IP Address' },
          { name: 'count', title: 'Times Seen Last 24 Hours' },
          { name: 'country', title: 'Country of Origin' },
          { name: 'asn', title: 'Autonomous System #' },
          { name: 'blacklisted', title: 'Blacklisted' },
        ]}
      >
        <RowDetailState />
        <SearchState />
        <IntegratedFiltering />
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <IntegratedPaging />
        <Table />
        <TableHeaderRow />
        <TableRowDetail contentComponent={renderHoneyBadgerDetails} />
        <Toolbar />
        <SearchPanel />
        <PagingPanel />
      </Grid>
    </div>
  )
}

HoneyBadgersTable.propTypes = {
  honeyBadgers: PropTypes.instanceOf(Map).isRequired,
}

export default HoneyBadgersTable
