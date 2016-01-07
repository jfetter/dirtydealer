'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			console.log('res', res.data)
			if(res.data=="login succesful"){
						UserService.loggedIn = 'true';
						console.log(UserService.loggedIn)
			}
			$state.go('home');
			var token = $cookies.get('token');
      var decoded = jwtHelper.decodeToken(token);
			console.log(decoded)
      for (var keys in decoded){
        if(keys === 'isAdmin'){
          decoded[keys] ? $rootScope.isAdmin = true : $rootScope.isAdmin = 'bananas'
      } else if(keys === "favorites"){
        localStorage[`${keys}`] = JSON.stringify(decoded[keys])
			} else{
        localStorage[`${keys}`] = decoded[keys]

        }
      }


		}, function(err) {
			console.error(err);
		});
	}
});
