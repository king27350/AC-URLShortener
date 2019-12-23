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
          const hashURL = 'localhost:3000/' + newShortener.hashURL
          res.render('new', { url, hashURL })
        }).catch(err => console.log(err))
    }
  })
})

app.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  Shortener.findOne({
    hashURL: shortURL
  }, (err, url) => {
    if (err) throw err
    return res.redirect(url.originalURL)
  })
})

app.listen(3000, () => {
  console.log('App is running on port 3000')
})