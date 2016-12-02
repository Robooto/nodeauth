var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('register', {title: 'Register'});
});

router.get('/login', (req, res, next) => {
  res.render('login', {title: 'Login'});
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), (req, res) => {

  req.flash('success', 'You are now logged in');
  res.redirect('/');
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((err, user) => {
  User.getById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) return done(err);

      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Password'});
      }
    })
  });
}))

router.post('/register', upload.single('profileimage'),(req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;

  if(req.file) {
    console.log('Uploading File...');
    var profileImage = req.file.filename;
  } else {
    console.log('No File to Upload');
    var profileImage = 'noimage.jpg';
  }

  // form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Check Errors
  let errors = req.validationErrors();
  if(errors) {
    res.render('register', {errors: errors});
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImage
    });

    User.createUser(newUser, function(error, user) {
      if(error) throw error;
      console.log(user);
    });

    req.flash('success', 'You are now registered and can login');
    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
