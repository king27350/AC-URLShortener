const express = require('express')
const app = express()
const mongoose = require('mongoose')

//basic mongoose setting
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected !')
})

//import shortener model
const Shortener = require('./models/shortener')


//routes
app.get('/', (req, res) => {
  res.send('indexpage')
})

app.listen('3000', () => {
  console.log('App is running on port 3000')
})