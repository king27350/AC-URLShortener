const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

//handlebars setting
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//basic mongoose setting
mongoose.connect('mongodb://localhost/shortener', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected !')
})

//import shortener model
const Shortener = require('./models/shortener')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

//routes
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {

  //check input URL if exist or not , if ! and then hash
  //把輸入的網址 加密
  // output the answer 
  // else true exist redirect '/' 
  // give it a hint to user
  Shortener.findOne({ originalURL: req.body.originalURL }).then(url => {
    if (url) {
      console.log('url exist')
    } else {
      const newShortener = new Shortener({
        originalURL: req.body.originalURL,
        hashURL: bcrypt.hashSync(`${req.body.originalURL}`, 10).slice(-5)
      })

      newShortener.save()
        .then(url => {
          const hashURL = newShortener.hashURL
          console.log(newShortener.hashURL)
          res.render('new', { hashURL })
        }).catch(err => console.log(err))
    }
  })
})

app.listen('3000', () => {
  console.log('App is running on port 3000')
})