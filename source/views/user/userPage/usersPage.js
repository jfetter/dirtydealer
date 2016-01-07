'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService){
	UserService.page($state.params.username)
	.then(function(res) {
		console.log("PARAMS", $state.params.name)
		$scope.user = res.data;
	}, function(err) {
		console.error(err)
	});
});
