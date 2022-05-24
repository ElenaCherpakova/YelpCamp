const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Campground = require('./models/campground')
const Review = require('./models/review')




module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in first')
    return res.redirect('/login')
  }
  next();
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', `You have no permission to edit this campground!`)
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findByIdAndDelete(reviewId)
  if (!review.author.equals(req.user._id)) {
    req.flash('error', `You have no permission to edit this campground!`)
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

// module.exports.ignoreFavicon = (req, res, next) => {
//   if (req.originalUrl.includes('favicon.ico')) {
//     res.status(204).end()
//   }
//   next();
// }

module.exports.ignoreFavicon = (req, res, next) => {
  if (req.originalUrl && req.originalUrl.split('/').pop().includes('favicon')) {
    return res.sendStatus(204);
  }
  return next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}
