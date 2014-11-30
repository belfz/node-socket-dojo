var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/html'));

app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', function(socket){
	socket.on('chatMessage', function(msg){
		if(msg.message == 'hal?'){
			setTimeout(function(){
				io.emit('chatMessage', {user: 'HAL9000', message: 'I can\'t let you do that, Dave.'});
			}, 1500);
		} else {
			socket.broadcast.emit('chatMessage', msg);
		}
	});

	/*
	 * Listen for incoming (from client) event.
	 */
	socket.on('writing', function(user){
		socket.broadcast.emit('writing', user);
	});
});

http.listen(3005, function(){
	console.log('listening on *:3005');
}); 