import express from 'express'

import apiService from './services/apiService'

const honeyBadgerApp = express()

// Handle API requests to our app
honeyBadgerApp.use(apiService)

export default honeyBadgerApp
