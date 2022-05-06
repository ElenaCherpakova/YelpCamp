const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
//layout extension instead of partials
const ejsMate = require('ejs-mate');


const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp'), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}

//connect Database
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error'))
db.once('open', () => {
  console.log('Database connected')
})

const app = express();
const path = require('path')


app.engine('ejs', ejsMate)
app.set('view engine', "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


app.get('/', (req, res) => {
  res.render('home')
})


app.all("*", (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong"
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log("Listening on PORT 3000")
}) 