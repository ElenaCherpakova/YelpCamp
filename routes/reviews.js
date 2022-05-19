const express = require('express')
const router = express.Router({ mergeParams: true });
const Review = require('../models/review')
const Campground = require('../models/campground')
const catchAsync = require("../utils/catchAsync")
const { validateReview } = require('../middleware')




router.post('/', validateReview, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  const review = new Review(req.body.review)
  campground.reviews.unshift(review)
  await review.save()
  await campground.save()
  req.flash('success', "Created a new review!")
  res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  req.flash('success', "Successfully Deleted Review!")
  res.redirect(`/campgrounds/${campground._id}`)
}))

module.exports = router;