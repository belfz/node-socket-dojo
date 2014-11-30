$(function(){
  var username = sessionStorage.getItem('username');
  if(username == null){
    username = prompt("What's your name?", "my name is...");
    sessionStorage.setItem('username', username);
  }

  var socket = io();

  var templateSource = $('#ownSection').html();
  var template = Handlebars.compile(templateSource);

  $('form').submit(function(){
    var messageObject = {user: username, message: $('#m').val()};
    $('#messages').append(
      template({username: username, message: messageObject.message})
      );
    socket.emit('chatMessage', messageObject);
    $('#m').val('');
    return false;
  });

/**
 * 'socket.on(...)' acts as a listener for incoming named events.
 * Second argument is a callback.
 */
  socket.on('chatMessage', function(messageObject){
    $('#messages').append($('<li>').text(messageObject.user + ': ' + messageObject.message));
    var userClass = messageObject.user;
    if($('.'+userClass).length > 0){
      $('.'+userClass).remove();
    }
  });

  $('#m').keydown(function(e){
    if(e.keyCode != 13){
      /*
       * Notify all about named event. Second argument is an object data.
       */
      socket.emit('writing', username);
    } else {

    }
  });

  socket.on('writing', function(user){
    if($('.'+user).length == 0){
      $('#messages').append($('<li class="'+user+'">').text(user + ' is writing...'))
      .promise().done(function(){
        setTimeout(function(){
          $('.'+user).remove();
        }, 2500);
      });
    }
  });
});