'use strict';

angular.module('socialMockup')

.controller('registerCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		console.log(user)
		if(user.password !== user.password2){
			alert('Passwords do not match');
			return;
		}
		UserService.register(user)
		.then(function(data){
			alert('You have sucessfully registered');
				$state.go('login');
		}, function(err){
			console.log(err);
		});
	}
});
