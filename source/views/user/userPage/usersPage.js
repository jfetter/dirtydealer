'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService){
	UserService.page($state.params.userId)
	.then(function(res) {
		console.log("PARAMS", $state.params.userId)
		$scope.user = res.data;
	}, function(err) {
		console.error(err)
	});
});
