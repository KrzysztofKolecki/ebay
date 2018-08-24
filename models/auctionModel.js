var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Auction = new Schema({
    username: String,
    buyNow: Boolean,
    auction: Boolean,
    title: String,
    price: Number,
    startingPrice: Number,
    finished: Boolean,
    buyer: String,
    duration: Number,
    description: String,
    img: String
});

module.exports = mongoose.model('Auction', Auction);
