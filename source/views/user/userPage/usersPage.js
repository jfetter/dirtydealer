'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService){
	UserService.page($state.params.username)
	.then(function(res) {
		console.log("PARAMS", $state.params.name)
		console.log(res.data.favorites)
		$scope.user = res.data;
		$scope.favorites = res.data.favorites;
	}, function(err) {
		console.error(err)
	});
});
