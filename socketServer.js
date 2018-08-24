let Conversation = require('./models/conversationModel');
let Auction = require('./models/auctionModel');

let connectedUsers = [];
let messagesToDeliver = [];

module.exports = function(io) {

    io.on('connection', function(socket) {    

        socket.on('newUser', function (user) {

            connectedUsers.push({
                "username": user.username, 
                "socket": socket.id
            });

            let message = messagesToDeliver.find(e => e.to === user.username);
            if(message) {
                setTimeout(() => {
                    socket.emit('newMessage', message);
                }, 2000);
                messagesToDeliver = messagesToDeliver.filter(e => e.to !== user.username);
            }

            console.log("New user!");
            console.log(connectedUsers);
    
        });
    
        
        socket.on('newMessage', function (data) {

            Conversation.findOne({$or: [{user1: data.from, user2: data.to}, {user1: data.to, user2: data.from}]}, function (err, conversation) {

                if(!conversation) {
                    
                    let newConversation = new Conversation({
                        user1: data.from,
                        user2: data.to,
                        conversation: [{
                            message: data.message,
                            auctionId: data.auctionId,
                            author: data.from,
                            date: Date.now()
                       }] 
                    });

                    newConversation.save(function (err) {
                        if (err){
                            console.log("Błąd przy tworzeniu konwersacji");
                            console.log(err);
                        }
                    });
                }

                else {
                    conversation.conversation.push({
                        message: data.message,
                        auctionId: data.auctionId,
                        author: data.from,
                        date: Date.now()
                    });
                    conversation.save(function (err) {
                        if (err){
                            console.log("Błąd przy tworzeniu konwersacji");
                            console.log(err);
                        }
                    });
                }


            });

            let recipient = connectedUsers.find(e => e.username === data.to);
            if(recipient) {
                socket.to(recipient.socket).emit('newMessage', data);
            }
            else {
                messagesToDeliver.push(data);
            }

        });

        socket.on('buyNow', function (data) {

            Auction.findById(data.auctionId, function(err, auction) {

                if(!auction.finished) {
                    auction.finished = true;
                    auction.buyer = data.username;

                    auction.save(function (err) {
                        if (err){
                            console.log("Błąd przy aktualizacji aukcji");
                            console.log(err);
                        }
                    });      
                }      
            });

            socket.emit("buyNow", auction);
        });

        socket.on('auctionBid', function (data) {

            Auction.findById(data.auctionId, function(err, auction) {

                if(!auction.finished && auction.price < data.bid) {

                    auction.buyer = data.username;
                    auction.price = data.bid;

                    auction.save(function (err) {
                        if (err){
                            console.log("Błąd przy aktualizacji aukcji");
                            console.log(err);
                        }
                    }); 
                    
                    socket.emit("auctionBid", data);
                    socket.broadcast.emit("auctionBid", data);
                    
                }      
            });
        });
    
        socket.on('disconnect', function (data) {
    
            let userToDelete = connectedUsers.find(e => e.socket === socket.id);

            if(userToDelete)
                connectedUsers = connectedUsers.filter(e => e.username !== userToDelete.username);
            
            console.log("Disconnected!");
            console.log(connectedUsers);

        });
    });

    

};
