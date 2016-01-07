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

      for (var keys in decoded){
        if(keys === 'isAdmin'){
          decoded[keys] ? UserService.userInfo.isAdmin = true : UserService.userInfo.isAdmin = false;
        } else{
					UserService.userInfo[`${keys}`] = decoded[keys]

        // localStorage[`${keys}`] = decoded[keys]
        }
      }


		}, function(err) {
			console.error(err);
		});
	}
});
