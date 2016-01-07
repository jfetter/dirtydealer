'use strict';

angular.module('socialMockup')

.controller('usersListCtrl', function($scope, $location, $rootScope, $state, UserService){
	console.log('hello')
	console.log(UserService)
	$scope.$watch(function(){return UserService.loggedIn}, function(n,o){UserService.loggedIn = n})
	if(UserService.loggedIn ===false){$location.path('/login')}
	UserService.list()
	.then(function(res) {

		console.log('res.data',res.data)
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
