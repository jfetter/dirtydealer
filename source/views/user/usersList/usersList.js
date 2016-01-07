'use strict';

angular.module('socialMockup')

.controller('usersListCtrl', function($scope, $state, UserService){
	UserService.list()
	.then(function(res) {
		console.log(res.data)
		$scope.users = res.data;
	}, function(err) {
		console.error(err)
	});
});
