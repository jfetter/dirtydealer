'use strict';

angular.module('socialMockup')

.controller('usersListCtrl', function($scope, $state, UserService){
	UserService.list()
	.then(function(res) {
		console.log(res.data)
		// $scope.users = res.data.filter(function(user){
		// 	return JSON.parse(localStorage.favorites).some(function(favorite){
		// 		return (user._id === favorite);
		// 	})
		// });
		users = res.data;
		$scope.users = users;
	}, function(err) {
		console.error(err)
	});
	var users;

	$scope.searchTerm ='';

	$scope.$watch(function(){return $scope.searchTerm}, function(n,o){
		$scope.updateSearch();
	})

	$scope.addFavorite = function (userId){
		UserService.favoriteUser(userId);
		console.log("USER!", userId)
	}

	$scope.favorited = function(user){
		if (user._id !== localStorage._id){
			return JSON.parse(localStorage.favorites).some(function(favorite){
				return (user._id === favorite)
			})
		} else {return true}
	}

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
