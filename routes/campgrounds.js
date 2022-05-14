const express = require('express')
const router = express.Router();
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas')

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}



router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', (req, res) => {
  if(!req.isAuthenticated()){
    req.flash('error', 'You must be logged in')
    res.redirect('/login')
  }
  res.render('campgrounds/new')
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground)
  await campground.save();
  req.flash('success', "Successfully create campground")
  res.redirect(`campgrounds/${campground._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews');
  if(!campground){
    req.flash('error', 'Campground is not Found')
    return res.redirect('/campgrounds')
  }
  // console.log(campground)
  res.render('campgrounds/show', { campground })
}))


router.get('/:id/edit', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground){
    req.flash('error', 'Campground is not Found')
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', "Successfully updated campground")
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id)
  req.flash('success', "Successfully Deleted Campground")
  res.redirect('/campgrounds')
}))


module.exports = router;