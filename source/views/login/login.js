'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			console.log('res: , ', res)
			$state.go('home');
		}, function(err) {
			console.error(err);
		});
	}
});
