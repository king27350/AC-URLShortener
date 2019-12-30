const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//handlebars setting
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//basic mongoose setting
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortener', { useNewUrlParser: true, useUnifiedTopology: true })

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

  Shortener.findOne({ originalURL: req.body.originalURL }).exec(url => {
    if (url) {
      const hashURL = 'https://evening-ocean-89417.herokuapp.com/' + url.hashURL
      return render('new', { url, hashURL })
    } else {
      const hashURL = generateHashURL()
      check(hashURL)

      const newShortener = new Shortener({
        originalURL: req.body.originalURL,
        hashURL: hashURL
      })

      newShortener.save()
        .then(url => {
          const hashURL = 'https://evening-ocean-89417.herokuapp.com/' + newShortener.hashURL
          res.render('new', { url, hashURL })
        }).catch(error => console.log(error))
    }
  })
})

app.get('/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL
  Shortener.findOne({
    hashURL: shortURL
  }, (err, url) => {
    if (err) console.log(err)
    if (url) {
      return res.redirect(url.originalURL)
    } else {
      res.redirect('/')
    }

  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('App is running on port 3000')
})


function generateHashURL() {
  const char = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'z', 'y', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  const num = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  const combination = getRandom(1, 4)
  const arr = []


  for (let i = 0; i < combination; i++) {
    const index = Math.floor(Math.random() * num.length)
    arr.push(num[index])
  }
  for (let j = 0; j < 5 - combination; j++) {
    const index = Math.floor(Math.random() * char.length)
    arr.push(char[index])
  }

  function randomSort(a, b) {
    return Math.random() > 0.5 ? -1 : 1
  }

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  return arr.sort(randomSort).join('')

}

function check(hashURL) {
  Shortener.findOne({ hashURL: hashURL }, (err, one) => {
    if (err) console.log(err)
    if (one) {
      return check(generateHashURL())
    }
  })
}