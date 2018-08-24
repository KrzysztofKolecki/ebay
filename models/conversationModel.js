var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Conversation = new Schema({
    user1: String,
    user2: String,
    conversation: [],
});

module.exports = mongoose.model('Conversation', Conversation);
