const Bootcamp = require("../models/bootcamp.js")
const ErrorResponse = require("../utils/errorResponse.js")
const asyncHandler = require("../middleware/async.js")
const geocoder = require("../utils/geocoder.js")

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
const getBootcamps = asyncHandler(
  async (req, res, next) => {
    let query

    // Coppy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    removeFields = ['select']

    // Loop over removeFields and delete them from request query
    removeFields.forEach(param => delete reqQuery[param])

    // Create query string
    let queryStr = JSON.stringify(reqQuery)

    // Create operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr))

    // Select Fields
    if(req.query.select) {
      const fields = req.query.select.split(',').join(' ')

      query = query.select(fields)
    }

    // Sort
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')

      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Execute request
    const bootcamps = await query

    // Pagination result
    const pagination = {}

    if(endIndex < total) {
      pagination.next = {
        page: page +1,
        limit
      }
    }

    if(startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps
    })
  }
)

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
const getBootcamp = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(!bootcamp) {
      return next(error)
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    })
  }
)

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
const createBootcamp = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
      success: true,
      data: bootcamp
    })
  }
)

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
const updateBootcamp = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if(!bootcamp) {
      return next(error)
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    })
  }
)

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
const deleteBootcamp = asyncHandler(
  async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if(!bootcamp) {
      return next(error)
    }

    res.status(200).json({ success: true, data: bootcamp })
  }
)

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
const getBootcampsInRadius = asyncHandler(
  async (req, res, next) => {
    const {zipcode, distance } = req.params

    //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 mi / 6,368 km
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    })
  }
)

module.exports = { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius }