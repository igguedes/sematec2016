var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var body = require('body-parser');


app.use(body.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




var activeUsers = [];
var posts = [];


function findUserConnected(id){
	return activeUsers.some(function(el){
		return el.id === id;
	});
}

function removeActiveUsers(socketId){
	for(i=0; i<activeUsers.length; i++){
		if(activeUsers[i].socketId == socketId){
			activeUsers.splice(i, 1);
		}
	}
}

io.on('connection', function(socket){
  console.log('usuario se conectou');
  socket.on('user connected', function(data){
  	userInfo = {
		socketId : socket.id,
		id: data.id,
		name: data.name
  	}

  	if(!findUserConnected(data.id)){
  		activeUsers.push(userInfo);
  		io.emit('user connected', userInfo.name);
  	}

  });

  socket.on('disconnect', function(){
  	console.log(socket.id);
  	removeActiveUsers(socket.id);
  	io.emit('user disconnected');
  });

  socket.on('new post', function(){
  	io.emit('new post');
  });


  socket.on('nova mensagem', function(nome, mensagem){
  	io.emit('nova mensagem', nome, mensagem);
  });



});



app.get('/lib/socket.io.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/socket.io.js');
});

app.get('/active-users', function(req,res){
	res.json(activeUsers);
});


app.get('/posts', function(req,res){
	res.json(posts);
});


app.post('/post', function(req,res){

	var msg = req.body;
	msg.idPost = msg.idEmissor + (new Date(msg.data).getMilliseconds());

	if(posts.unshift(msg)){
		res.json({
			status: 'success'
		})
	}else{
		res.json({
			status: 'fail'
		})
	}
});


app.post('/delete/:id', function(req,res){

	var idPost = req.params.id;
	for(i=0;i<posts.length;i++){
		if(posts[i].idPost == idPost){
			posts.splice(i, 1);
			res.json({
				status: "success"
			});
			break;
		}
	}

});


http.listen(4000, function(){
	console.log("Servidor iniciado");
});
