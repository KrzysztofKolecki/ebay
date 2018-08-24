var express = require('express');
var router = express.Router();
var passport = require('passport');
var Auction = require('../models/auctionModel');
var mime = require('mime-types');

router.get('/new', function(req, res) {

  if(!req.user) res.redirect('/login');
  else res.render('newAuctionForm', { user : req.user });
});

router.get('/', function(req, res) {

  Auction.findById(req.query.id, function(err, auction) {

    res.render('auction', { title: auction.title, user: req.user, auction: auction });

  });

});

router.post('/add', function(req, res) {

  if(!req.user) res.redirect('/login');

  let newAuction = new Auction({
    username: req.user.username,
    buyNow: (req.body.typeOfAuction === "buyNow" ? true : false),
    auction: (req.body.typeOfAuction === "auction" ? true : false),
    title: req.body.title,
    price: req.body.price || req.body.startingPrice || 0,
    startingPrice:  req.body.startingPrice || 0,
    duration: Date.now() + 60000*req.body.duration || 0,
    description: req.body.description,
    img: ""
  });

  if(newAuction.auction) {
    setTimeout(() => {
      newAuction.finished = true;
      newAuction.save(function (err, auction) {
        if (err){
          console.log("Błąd przy aktualizacji aukcji");
          console.log(err);
        }
      });
    }, 60000*req.body.duration);
  }

  if(req.files.pic){
    
    let img = req.files.pic;
    let imgId = newAuction._id;

    img.mv(`public/images/${imgId}.${mime.extension(img.mimetype)}`, function(err) {
      if (err) console.log(err);      
    });

    newAuction.img = `${imgId}.${mime.extension(img.mimetype)}`;
  }
  else {
    newAuction.img = "no_foto.png";
  }
  
  newAuction.save(function (err, auction) {
    if (err){
      console.log("Błąd przy tworzeniu aukcji");
      console.log(err);
    }
  });

  res.redirect("/");
});

module.exports = router;
