'use strict';

angular.module('cardsAgainstHumanity')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			if(res.data=="login succesfull"){
				UserService.loggedIn = 'true';
				$scope.$emit('loggedIn');
				$state.go('userPage', {"username": user.username})
			} else if (res.data === "Incorrect Username or Password!"){
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: res.data,
					showConfirmButton: true,
					confirmButtonText: "I hear ya.",
				});
			}
			var token = $cookies.get('token');
			var decoded = jwtHelper.decodeToken(token);
		}, function(err) {
			console.error(err);
		});
	}

});
