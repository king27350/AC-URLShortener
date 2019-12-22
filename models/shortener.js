const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shortenerSchema = new Schema({
  originalURL: {
    type: String,
    required: true
  },
  hashURL: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Shortener', shortenerSchema)