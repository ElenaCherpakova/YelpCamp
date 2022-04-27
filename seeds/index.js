const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')
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

//passing an array and return random element from that array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)}, ${sample(places)} `,
      image: "https://source.unsplash.com/collection/483251",
      description: 'Camp provides a safe space for campers to be who they are and make long lasting friendships. Campers are encouraged to have fun, grow and develop their skills through activities such as canoeing, sailing, swimming, arts and crafts, and many other exciting activities.',
      price
    })
    await camp.save()
  }

}



seedDB().then(() => {
  mongoose.connection.close()
})