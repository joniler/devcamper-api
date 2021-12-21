const express = require('express')
const { register, login, getMe } = require('../controllers/auth')
const { protect, authorize } = require('../middleware/auth')

const auth = express.Router()

auth.post('/register', register)
auth.post('/login', login)
auth.get('/me', protect, getMe)

module.exports = auth