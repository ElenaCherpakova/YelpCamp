const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')


const ImageSchema = new Schema({
  url: String,
  filename: String
})

//We store url image in our MongoDB and we just derive(take) from the info that we're already store
//every time we call thumbnail, it's going to do this calculation
ImageSchema.virtual('thumbnail').get(function () {
  //return url from that image (this)
  return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})


CampgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})


module.exports = mongoose.model('Campground', CampgroundSchema)