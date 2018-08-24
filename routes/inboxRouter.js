var express = require('express');
var router = express.Router();
var Conversation = require('../models/conversationModel');

router.get('/', function(req, res) {
    
    if(!req.user) res.redirect('/login');

    else {


        Conversation.find({$or: [{user1: req.user.username}, {user2: req.user.username}]}, function (err, conversations) {
            res.render('inbox', { title: "Wiadomości", user: req.user, conversations: conversations}); 
        
        });
   
    }


});

router.get('/get', function(req, res) {

    if(!req.user) res.redirect('/login');
    
    Conversation.findById(req.query.id, function(err, conversation) {

        res.render('conversation', { title: "Wiadomości", user: req.user, conversation: conversation });
    
      });
});


module.exports = router;