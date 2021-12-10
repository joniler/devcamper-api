const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius } = require('../controllers/bootcamps.js')

  // Include other resource routers
  const courseRouter = require('./courses')

const bootcamps = express.Router()

// Reroute into other resource routers
bootcamps.use('/:bootcampId/courses', courseRouter)

bootcamps.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

bootcamps
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp)

bootcamps
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

module.exports = bootcamps