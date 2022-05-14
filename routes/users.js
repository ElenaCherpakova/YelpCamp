const express = require('express')
const router = express.Router();
const User = require('../models/user')
const catchAsync = require("../utils/catchAsync")
const passport = require('passport');
const { resetWatchers } = require('nodemon/lib/monitor/watch');

router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/campgrounds');
  }
  res.render('users/register')
})


router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ username, email })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err => { //no await here because it doesn't support it
      if (err) return next(err)
      req.flash('success', `Welcome to Yelp Camp, ${username}!`)
      res.redirect('/campgrounds')
    })

  } catch (err) {
    req.flash('error', err.message)
    res.redirect('/register')
  }
}))



router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/campgrounds');
  }
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  const { username } = req.body
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo
  req.flash('success', `Welcome Back, ${username}!`)
  res.redirect(redirectUrl)

})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', "See you Soon!")
  res.redirect('/campgrounds')
})


module.exports = router;