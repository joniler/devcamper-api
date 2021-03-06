const mongoose = require("mongoose")

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })

  console.log('MongoDB Connected:'.bgBlue.black.bold + ` ${conn.connection.host}`.blue.bold)
}

module.exports = connectDB