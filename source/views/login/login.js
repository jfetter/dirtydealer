'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			var token = $cookies.get('token');
      console.log('res: , ', res)
      var decoded = jwtHelper.decodeToken(token);
      for (var keys in decoded){

        if(keys === 'isAdmin'){
          console.log('If')
          
          decoded[keys] ? $rootScope.isAdmin = true : $rootScope.isAdmin = 'bananas'
        } else{
        console.log('Else')
        localStorage[`${keys}`] = decoded[keys]
        }
      }
      
			
		}, function(err) {
			console.error(err);
		});
	}
});
