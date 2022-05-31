const Campground = require('../models/campground')
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()
  const campground = new Campground(req.body.campground);
  if (!geoData.body.features.length) {
    req.flash('error', 'Location is not Found!')
    return res.redirect('/campgrounds/new')
  }
  campground.geometry = geoData.body.features[0].geometry;
  //map array and store path and filename as an obj in req.files
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id
  await campground.save();
  console.log(campground)
  req.flash('success', "Successfully create campground")
  res.redirect(`campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');

  if (!campground) {
    req.flash('error', 'Campground is not Found')
    return res.redirect('/campgrounds')
  }
  // console.log(campground)
  res.render('campgrounds/show', { campground })
}

module.exports.renderEditCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Campground is not Found')
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    //delete from cloudinary
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    //delete images from MongoDB: we pull from images array all images where filename of that image IS IN req.body.deleteImages array
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }
  req.flash('success', "Successfully updated campground!")
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id)
  req.flash('success', "Successfully Deleted Campground!")
  res.redirect('/campgrounds')
}