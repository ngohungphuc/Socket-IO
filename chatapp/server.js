var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 8080;
var users = [];
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket) {
	console.log('new connection made');
	//show all users
	socket.on('get-users', function() {
		//broadcast to only socket that have initial request
		socket.emit('all-users', users);
	});

	//when new user joins
	socket.on('join', function(data) {
		console.log(data);
		console.log(users);
		socket.nickname = data.nickname;
		users[socket.nickname] = socket;
		var userObj = {
			nickname: data.nickname,
			socketid: socket.id
		}
		users.push(userObj);
		//io.emit broad cast to all connected user
		io.emit('all-users', users);
	});

	socket.on('send-message', function(data) {
		socket.broadcast.emit('message-received', data);
	});
});

server.listen(port, function() {
	console.log("Listening on port " + port);
});
