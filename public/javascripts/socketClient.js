let socket = io();
if(user) socket.emit("newUser", user);

socket.on('newMessage', function(data){

    if(!window.location.href.includes("inbox")) {
        let r = confirm("Nowa wiadomość od " + data.from + "\n\nPrzejść do wiadomości?");
        if (r === true) {
            window.location.href = "/inbox";
        }
    }
});