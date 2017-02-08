app.factory("User", function($location, $q, $http){

	var User = {};

	function storeFacebookData(facebookData){
		var defer = $q.defer();

		User.id = facebookData.id;
		User.name = facebookData.name;

		localStorage.setItem("User", JSON.stringify(User));

		defer.resolve();
		
		return defer.promise;
	}


	function deleteFacebookData(){
		if(localStorage.User){
			localStorage.removeItem("User");
		}
	}


	function _login(callback){
		FB.login(function(response) {
			    if (response.authResponse) {
			     	FB.api('/me', function(response) {
			       		storeFacebookData(response).then(function(){
			       			callback();
			       			$location.path('/main');
			       		});
			    	});

			    } else {
			     	console.log('User cancelled login or did not fully authorize.');
			    }
		});
	}

	function _logout(){
		FB.logout(function(response) {});
		deleteFacebookData();
		$location.path('/');
	}

	function _getUser(){
		if(localStorage.getItem("User") != null){
			User = JSON.parse(localStorage.getItem("User"));
			return {
				name: User.name,
				id: User.id
			}
		}else{
			return {}
		}
	}


	function _isLoggedIn(){

		if(localStorage.getItem("User") != null){
			return true;
		}else{
			return false;
		}
	}

	function _getConnectedUsers(){
		return $http.get('/active-users');
	}

	function _getPosts(){
		return $http.get('/posts');
	}

	function _newPost(msg){
		var post = {
			idEmissor: _getUser().id,
			emissor: _getUser().name,
			data: new Date(),
			mensagem: msg
		}

		return $http.post('/post',post);
	}

	function _deletePost(idPost){
		return $http.post('/delete/' + idPost);
	}


	return {
		login: _login,
		getUser : _getUser,
		logout : _logout,
		isLoggedIn : _isLoggedIn,
		getConnectedUsers : _getConnectedUsers,
		getPosts : _getPosts,
		newPost : _newPost,
		deletePost : _deletePost
	}
});