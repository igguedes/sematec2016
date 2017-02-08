app.factory("Socket", function(){
	var _chanel = io();

	return {
		chanel: _chanel
	}
	
});