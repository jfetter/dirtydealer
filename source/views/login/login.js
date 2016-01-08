'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
      console.log(res.data)
      if(res.data === "login succesfull"){
			  console.log('res: , ', res)
        UserService.loggedIn = "true";
        $scope.$emit('loggedIn')
			  var token = $cookies.get('token');
        var decoded = jwtHelper.decodeToken(token);
			  $state.go('usersList');
        console.log(token)
        console.log('res: , ', res)
      }
    })
  }
});
