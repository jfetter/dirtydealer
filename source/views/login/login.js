'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
// <<<<<<< HEAD
			console.log('res', res.data)
			if(res.data=="login succesfull"){
						UserService.loggedIn = 'true';
						$scope.$emit('loggedIn');
						$state.go('usersList');
			}
			var token = $cookies.get('token');
      var decoded = jwtHelper.decodeToken(token);
		}, function(err) {
			console.error(err);
		});
	}
// =======
//       console.log(res.data)
//       if(res.data === "login succesfull"){
// 			  console.log('res: , ', res)
//         UserService.loggedIn = "true";
//         $scope.$emit('loggedIn')
// 			  var token = $cookies.get('token');
//         var decoded = jwtHelper.decodeToken(token);
// 			  $state.go('usersList');
//         console.log(token)
//         console.log('res: , ', res)
//       }
//
//     })
//   }
// >>>>>>> 0b42ef7e9ab4cebb9dde94bfd3cdf2ce079369c9
});
