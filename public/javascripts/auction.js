$(function() { 

    let user = $('input#senderName').attr('placeholder');
    let receiver = $('input#receiverName').attr('placeholder');
    
    $('#sendMessageButton').on('click', function() {
        let message = $('#messageText').val();
        let url = new URL(window.location.href);

        socket.emit('newMessage', {
            from: user,
            to: receiver,
            message: message,
            auctionId: url.searchParams.get("id")
        });

        $('#messageModal').modal('hide');
        alert("Wysłano wiadomość!");
    });

    $('#buyNowButton').on('click', function() {

        if(!user) alert("Aby kupić przedmiot musisz być zalogowany!");

        else {
            let url = new URL(window.location.href);

            if(confirm("Czy na pewno chcesz kupić przedmiot?")) {
                socket.emit('buyNow', {
                    username: user,
                    auctionId: url.searchParams.get("id")
                });
            }

            location.reload(); 
        }
        
    });

    $('#auctionButton').on('click', function() {

        if(!user) alert("Aby licytować przedmiot musisz być zalogowany!");

        else {
            let url = new URL(window.location.href);
            let bid = $('#newOfferInput').val();

            socket.emit('auctionBid', {
                username: user,
                auctionId: url.searchParams.get("id"),
                bid: bid
            });

        }
        
    });

    socket.on('auctionBid', function(data) {
        $('#actualPrice').text(data.bid + " zł");
        $('#highestBidUsername').text(" (" + data.username + ")");
    });

    if ($('.auctionPrice').length) {

        let x = setInterval(function() {

            let now = new Date().getTime();
    
            let distance = duration - now;
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
            document.getElementById("timer").innerHTML = "Do końca aukcji: " + minutes + "m " + seconds + "s ";
    
            if (distance < 0) {
                clearInterval(x);
                document.getElementById("timer").innerHTML = "Koniec aukcji";
                $('.newOffer').hide();
            }
        }, 1000);

    }
  

});