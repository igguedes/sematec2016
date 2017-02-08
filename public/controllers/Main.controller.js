var app = angular.module("Sematec", ["ngRoute"]);
app.controller("MainCtrl", function($scope, Socket, User){

	$scope.connectedUsers = [];

	$scope.getConnectedUsers = function(){
		User.getConnectedUsers().success(function(data){
			$scope.connectedUsers = data;
		});
	}

	$scope.getConnectedUsers();

	Socket.chanel.on('user connected', function(name){
		if(name !== User.getUser().name){
			toastr.info(name + " acabou de entrar!");
		}
		$scope.getConnectedUsers();
	});

	Socket.chanel.on('user disconnected', function(){
		$scope.getConnectedUsers();
	});	

	
});

app.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl : 'views/login.html',
		controller : 'UserCtrl'
	})
	.when('/publication', {
		templateUrl : 'views/publication.html',
		controller : 'UserCtrl'
	})
	.when('/main', {
		templateUrl : 'views/main.html',
		controller : 'UserCtrl'
	})
});