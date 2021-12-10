const express = require('express')
const {
  getCourses
} = require('../controllers/courses.js')

const courses = express.Router({ mergeParams: true })

courses
  .route('/')
  .get(getCourses)

module.exports = courses
