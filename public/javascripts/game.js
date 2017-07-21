$(function() {

var c = document.getElementById("game");
var ctx = c.getContext("2d");
var socket = io.connect('/');
var map = {
  type: 'map',
  users: []
}

var createRandom = function (min, max) {
  var newRandom = Math.floor((Math.random() * max) + min);
  return newRandom;
}

var user = {
  name: '',
  userId: 0
}

var users = [];
var auth = "";

socket.on('message', function(data) {
  data = JSON.parse(data);
  console.log('message received');
  console.log(data);
  if (data.username) {
    $('#messages').append('<div class="'+data.type+'"><span class="name">' + data.username + ":</span> " + data.message + '</div');
  }

  if (data.type === 'connection') {
    auth = data.cookie;
  }

  if (data.type === 'messages') {
    const allChatMessages = data.chats;
    const listElements = $('#chatroom-messages').children();
    if (listElements.length.length < 1) {
      for (var i = 0; i < allChatMessages.length; i++) {
        $("#chatroom-messages").append('<li>' + allChatMessages[i] + '</li>')
      }
    } else {
        $("#chatroom-messages").append('<li>' + allChatMessages.pop() + '</li>')
    }
  }

  if (data.type === "serverMessage") {
    $('#messages').append($('<ul>').text(data.message));
    user.userId = data.userId;
    map.users[user.userId] = {};
  };

  if (data.type === "mapMessage") {
    for (var n = 0; n < data.message.users.length; n++){
      map.users[n] = data.message.users[n];
    }
  }
});

window.onkeydown = function(e) {
  //e.preventDefault();
  var check;
  var key = e.keyCode ? e.keyCode : e.which;
}

$('#send').on('click', function (clicked) {
  console.log('clicked');
  const messageToSend = $('#message').val();
  $('#message').val('');
  if (messageToSend.length < 1) {
    alert('Make sure to actually write a message!');
    return;
  }
  if (messageToSend.length > 20) {
    alert('Too long!');
    return;
  }
  var payload = {
    type: 'textMessage',
    msg: messageToSend
  };
  socket.send(JSON.stringify(payload));
});

$('#setname').on('click', function(clicked) {
  socket.emit("set_name", {name: $('#nickname').val() });
});

})
