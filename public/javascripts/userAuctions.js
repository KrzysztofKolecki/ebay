$(function() { 


    socket.on('auctionBid', function(data) {
        $('#auctionPrice').text("Licytacja: " + data.bid + " zł");
    });

  

});