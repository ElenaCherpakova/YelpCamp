const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
//layout extension instead of partials
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError")
const catchAsync = require("./utils/catchAsync")

const Campground = require('./models/campground')

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
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))



app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
});

app.post('/campgrounds', catchAsync(async (req, res, next) => {
  if (!req.body.campground) throw new ExpressError('Invalid campground Data', 400)
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`campgrounds/${campground._id}`)
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show', { campground })
}))


app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))

app.all("*", (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).send(message)
  res.send('Something went wrong')
})

app.listen(3000, () => {
  console.log("Listening on PORT 3000")
})