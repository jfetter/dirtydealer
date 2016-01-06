'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			console.log('res: , ', res)
			
		}, function(err) {
			console.error(err);
		});
	}
});
