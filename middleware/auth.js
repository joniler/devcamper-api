const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')

exports.protect = asyncHandler( async (req, res, next) => {
  let token

  // Check headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  // else if(req.cookies.token) {
  //   token = req.cookies.token
  // }

  // Make sure token exists
  if(!token) {
    return next(new ErrorResponse('Not authorized', 401))
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    console.log(decoded)

    req.user = await User.findById(decoded.id)

    next()
  } catch (error) {
    return next(new ErrorResponse('Not authorized', 401))
  }
})

// Grants access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not autorized to access this route.`, 403))
    }
    next()
  }
}