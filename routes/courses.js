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

courses
  .route('/')
  .get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
  }), getCourses)
  .post(addCourse)

courses
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse)

module.exports = courses
