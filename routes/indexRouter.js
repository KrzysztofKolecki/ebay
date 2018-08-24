var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/accountModel');
var Auction = require('../models/auctionModel');

/* GET home page. */
router.get('/', function(req, res, next) {

  let numberOfAuctions = 0;
  let page = req.query.page || 1;
  let auctionsPerPage = 5;

  Auction.count({}, function( err, count){
    numberOfAuctions = count;
  });

  Auction.find({}, function(err, auctions) {
    res.render('index', { title: 'Strona główna', user: req.user, auctions: auctions, numberOfAuctions: numberOfAuctions });
  }).skip(auctionsPerPage * (page-1)).limit(auctionsPerPage).sort( { duration: -1 } );
});


router.get('/register', function(req, res) {
  res.render('register', { });
});

router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    
    if(err) {

      if (err.name === 'MissingUsernameError') {
        return res.render('register', { error : "Podaj nazwę użytkownika!" });
      }
      if (err.name === 'MissingPasswordError') {
        return res.render('register', { error : "Podaj hasło!" });
      }
      if (err.name === 'UserExistsError') {
        return res.render('register', { error : "Użytkownik o tym loginie już istnieje." });
      }
      if (err.name === 'IncorrectUsernameError' || err.name === 'IncorrectPasswordError') {
        return res.render('register', { error : "Zły login lub hasło!" });
      }
      else {
        return res.render('register', { error : "Wystąpił błąd, spróbuj ponownie." });
      }

    }

    passport.authenticate('local')(req, res, function () {
        res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.render('login', { error: "Zły login lub hasło." });
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/userAuctions', function(req, res, next) {

  if(!req.user) res.redirect('/login');

  let numberOfAuctions = 0;
  let page = req.query.page || 1;
  let auctionsPerPage = 5;

  Auction.count({$or: [{username: req.user.username}, {buyer: req.user.username}]}, function(err, count){
    numberOfAuctions = count;
  });

  Auction.find({$or: [{username: req.user.username}, {buyer: req.user.username}]}, function(err, auctions) {
    res.render('userAuctions', { title: 'Twoje aukcje', user: req.user, auctions: auctions, numberOfAuctions: numberOfAuctions });
  }).skip(auctionsPerPage * (page-1)).limit(auctionsPerPage).sort( { duration: -1 } );
});

module.exports = router;
