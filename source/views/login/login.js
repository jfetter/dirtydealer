'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){

			console.log('res', res.data)
			if(res.data=="login succesfull"){
						// console.log("EUSER", user)
						UserService.loggedIn = 'true';
						$scope.$emit('loggedIn');
						$state.go('userPage', {"username": user.username})
			}
			var token = $cookies.get('token');
      var decoded = jwtHelper.decodeToken(token);
		}, function(err) {
			console.error(err);
		});
	}

});
