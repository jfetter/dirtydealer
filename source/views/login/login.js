'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			console.log('res', res.data)
			if(res.data=="login succesfull"){
						// console.log(inLogin())
						UserService.loggedIn = 'true';
						// $rootScope.isLoggedIn = 'true';
						$scope.$emit('loggedIn');
						console.log("ROOT SCOPE", $rootScope)
						console.log(UserService.loggedIn)
			}
			$state.go('usersList');
			var token = $cookies.get('token');
      var decoded = jwtHelper.decodeToken(token);
		}, function(err) {
			console.error(err);
		});
	}
});
