import express from 'express'
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp } from '../controllers/bootcamps.js'

const bootcamps = express.Router()

bootcamps
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp)

bootcamps
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

export default bootcamps