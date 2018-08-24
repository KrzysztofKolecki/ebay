$(function() { 

    let sender = $('input#senderName').attr('placeholder');
    let receiver = $('input#receiverName').attr('placeholder');
    
    $('#sendMessageButton').on('click', function() {
        let message = $('#messageText').val();

        $('#messageText').val('');

        $( ".conversation ul" ).append( "<li class='list-group-item col-12'>" + sender + ": " +  message + "</li>" );

        socket.emit('newMessage', {
            from: sender,
            to: receiver,
            message: message
        });

    });

    socket.on('newMessage', function(data){
 
        $( ".conversation ul" ).append( "<li class='list-group-item col-12'>" + data.from + ": " +  data.message + "</li>" );
    });

});