'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			$state.go('home.index');
		}, function(err) {
			console.error(err);

		});
	}
});
