'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
      if(res.data === "login successfull"){
			  console.log('res: , ', res)
			  $state.go('userslist');
        UserService.loggedIn = "true";
        $scope.$emit('loggedIn')
			  var token = $cookies.get('token');
      }

      console.log(token)
      console.log('res: , ', res)
      var decoded = jwtHelper.decodeToken(token);
    })
  }
});
