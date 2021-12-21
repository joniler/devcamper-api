const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload } = require('../controllers/bootcamps.js')

  const Bootcamp = require('../models/Bootcamp')
  const advancedResults = require('../middleware/advancedResults')

  // Include other resource routers
  const courseRouter = require('./courses')

const bootcamps = express.Router()

const { protect, authorize } = require('../middleware/auth')

// Reroute into other resource routers
bootcamps.use('/:bootcampId/courses', courseRouter)

bootcamps.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

bootcamps.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

bootcamps
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp)

bootcamps
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

module.exports = bootcamps