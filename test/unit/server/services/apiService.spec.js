// ESLint config
//
// Although ESLint prefers arrow functions we disable any warnings/errors for not using them as
// Mocha discourages its use as we the Mocha context can't be accessed.For more info see:
// https://mochajs.org/#arrow-functions
/* eslint func-names: 0, prefer-arrow-callback: 0 */
//
// The use of Chai/expect assertions causes ESLint to believe we have a bunch of unused
// expressions (we do I guess). We disable the check for them and use an ESLint check that ignores
// any unused expressions from the use of Chai/expect assertions.
/* eslint no-unused-expressions: 0, chai-friendly/no-unused-expressions: 2 */

// Supporting test libs
import request from 'supertest'
import { expect } from 'chai'

// Supporting lips
import express from 'express'

// Code under test
import apiService from './../../../../src/server/services/apiService'

describe('HoneyBadgerApp service test: apiService', function() {
  // Our HTTP request interface that will be bound to our running app
  let httpRequest = null

  before('Setup server', function() {
    const app = express()
    app.use(apiService)

    httpRequest = request(app)

    expect(httpRequest).to.exist
  })

  it('200 OK', function(done) {
    httpRequest.get('').expect(200, done)
  })

  it('Content-Type: application/json', function(done) {
    httpRequest
      .get('')
      .expect('Content-Type', 'application/json; charset=utf-8', done)
  })

  it('Body contains correct content', function(done) {
    httpRequest
      .get('')
      .expect((res) => {
        expect(res.body.status).to.exist
        expect(res.body.status).to.equal('API service is handling requests')
      })
      .end(done)
  })
})
