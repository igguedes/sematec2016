app.controller("UserCtrl", function($scope, User, $location, Socket){

	$scope.id = User.getUser().id;
	$scope.name = User.getUser().name;
	$scope.isLoggedIn = User.isLoggedIn();
	$scope.posts = [];

	if($scope.isLoggedIn){
		Socket.chanel.emit('user connected', {id:User.getUser().id,name:User.getUser().name});
	}

	if($location.path() == "/publication"){
		if(!User.isLoggedIn()) $location.path("/");
	}
	else if($location.path() == "/main"){
		if(!User.isLoggedIn()) $location.path("/");
	}
	else if($location.path() == "/"){
		if(User.isLoggedIn()) $location.path("/main");
	}


	$scope.getPosts = function(){
		User.getPosts().success(function(posts){
			$scope.posts = posts;
		});
	}

	$scope.getPosts();

	Socket.chanel.on('new post', function(){
		$scope.getPosts();
	});


	updateLoginStatus = function(){
		$scope.isLoggedIn = User.isLoggedIn();
	}

	$scope.login = function(){
		User.login(function(){
			$scope.id = User.getUser().id;
			$scope.name = User.getUser().name;
			updateLoginStatus();
		});
	}


	$scope.logout = function(){
		User.logout();
		updateLoginStatus();
		Socket.chanel.disconnect();	
		location.reload();
	}



	$scope.newPost = function(msg){
		User.newPost(msg).success(function(response){
			if(response.status == 'success'){
				toastr.success('Sua mensagem foi postada com sucesso');
				Socket.chanel.emit('new post');
			}
		});
		$location.path('/main');
	}

	$scope.deletePost = function(idPost){
		User.deletePost(idPost).success(function(response){
			if(response.status == 'success'){
				toastr.warning("Seu post Foi deletado");
				Socket.chanel.emit('new post');
			}
		});
	}


});