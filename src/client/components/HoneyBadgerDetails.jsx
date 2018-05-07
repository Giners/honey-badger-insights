import React from 'react'
import PropTypes from 'prop-types'

import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

const renderASDetails = as => (
  <Paper>
    <Typography align="center" variant="title">
      Autonomous System
    </Typography>
    {as ? (
      <Grid container>
        <Grid item xs={4}>
          <Typography>
            <b>Name:</b>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{as.name}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            <b>ASN:</b>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{as.asn}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            <b>Country Code:</b>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{as.countryCode}</Typography>
        </Grid>
      </Grid>
    ) : (
      <Typography align="center">Loading...</Typography>
    )}
  </Paper>
)

const renderGeoLocationDetails = geoLocation => (
  <Paper>
    <Typography align="center" variant="title">
      Location
    </Typography>
    {geoLocation ? (
      <Grid container>
        <Grid item xs={4}>
          <Typography>
            <b>Continent:</b>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{geoLocation.continent}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            <b>Country:</b>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{geoLocation.country}</Typography>
        </Grid>
      </Grid>
    ) : (
      <Typography align="center">Loading...</Typography>
    )}
  </Paper>
)

const renderBlacklistsDetails = blacklists => (
  <Paper>
    <Typography align="center" variant="title">
      Blacklists
    </Typography>
    {blacklists ? (
      <Grid container>
        <Grid item xs={4}>
          <Typography>
            <b>Blacklisted:</b>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {blacklists.length > 0 ? (
            <Typography color="error">BLACKLISTED</Typography>
          ) : (
            <Typography>Not blacklisted</Typography>
          )}
        </Grid>
        <Grid item xs={4}>
          <Typography>
            <b>Blacklists:</b>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {blacklists.length > 0 ? (
            <Typography>{blacklists.join(', ')}</Typography>
          ) : (
            <Typography>-</Typography>
          )}
        </Grid>
      </Grid>
    ) : (
      <Typography align="center">Loading...</Typography>
    )}
  </Paper>
)

const HoneyBadgerMap = withGoogleMap(({ latitude, longitude }) => (
  <GoogleMap defaultZoom={10} defaultCenter={{ lat: latitude, lng: longitude }}>
    <Marker position={{ lat: latitude, lng: longitude }} />
  </GoogleMap>
))

const HoneyBadgerDetails = ({ honeyBadger }) => {
  const { geoLocation, as, blacklists } = honeyBadger

  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <Paper>
          <HoneyBadgerMap
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            latitude={geoLocation.latitude}
            longitude={geoLocation.longitude}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        {renderASDetails(as)}
      </Grid>
      <Grid item xs={12} sm={4}>
        {renderGeoLocationDetails(geoLocation)}
      </Grid>
      <Grid item xs={12} sm={4}>
        {renderBlacklistsDetails(blacklists)}
      </Grid>
    </Grid>
  )
}

HoneyBadgerDetails.propTypes = {
  honeyBadger: PropTypes.shape({
    as: PropTypes.shape({
      name: PropTypes.string.isRequired,
      asn: PropTypes.number.isRequired,
      countryCode: PropTypes.string.isRequired,
    }).isRequired,
    geoLocation: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      continent: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default HoneyBadgerDetails
