const express = require('express')
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses.js')

const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')

const courses = express.Router({ mergeParams: true })

const { protect, authorize } = require('../middleware/auth')

courses
  .route('/')
  .get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
  }), getCourses)
  .post(protect, authorize('publisher', 'admin'), addCourse)

courses
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = courses
