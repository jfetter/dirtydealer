'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){

			console.log('res: , ', res)
			$state.go('home');

			var token = $cookies.get('token');
      var decoded = jwtHelper.decodeToken(token);
      for (var keys in decoded){
        if(keys === 'isAdmin'){
          decoded[keys] ? $rootScope.isAdmin = true : $rootScope.isAdmin = 'bananas'
        } else{
        localStorage[`${keys}`] = decoded[keys]
        }
      }


		}, function(err) {
			console.error(err);
		});
	}
});
