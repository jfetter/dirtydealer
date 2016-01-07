'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
<<<<<<< HEAD
			console.log('res: , ', res)
			$state.go('home');
=======
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
      
			
>>>>>>> 27c45e18ac5790f07da12666172244459dd8a9a4
		}, function(err) {
			console.error(err);
		});
	}
});
