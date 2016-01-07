'use strict';

angular.module('socialMockup')


.controller('usersListCtrl', function($scope, $location, $rootScope, $state, $cookies, UserService){
	console.log("cookies.get", $cookies.get('token'))
	UserService.isAuthed($cookies.get('token'))
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
	UserService.list()
	.then(function(res) {

		$scope.users = res.data;
		users = res.data;
	}, function(err) {
		console.error(err)
	});
	var users;

	$scope.searchTerm ='';

	$scope.$watch(function(){return $scope.searchTerm}, function(n,o){
		$scope.updateSearch();
	})




	$scope.updateSearch = function(){
		if($scope.searchTerm){
		$scope.users = $scope.users.filter(function(user){
			if (user.username.match($scope.searchTerm)){
				return true
			} else{
				return false
			}
		})
		if(!$scope.users){}
	} else{
		$scope.users = users
	}



	}
})
