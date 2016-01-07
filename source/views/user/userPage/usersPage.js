'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, $location){
	var cookies = $cookies.get('token');
	UserService.page($state.params.username)
	.then(function(res) {
		console.log("PARAMS", $state.params.name)
		console.log(res.data.favorites)
		$scope.user = res.data;
		$scope.favorites = res.data.favorites;
	}, function(err) {
		console.error(err)
	});
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
});
