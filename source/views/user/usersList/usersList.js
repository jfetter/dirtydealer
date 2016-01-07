'use strict';

angular.module('socialMockup')


.controller('usersListCtrl', function($scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper){
	console.log("cookies.get", $cookies.get('token'))
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
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

	// $scope.searchTerm = '';

	$scope.$watch(function(){return $scope.searchTerm}, function(n,o){
		$scope.updateSearch();
	})

	$scope.addFavorite = function (userId){
		UserService.favoriteUser(userId)
		.then(function(res){
			$scope.userInfo = (jwtHelper.decodeToken(res.data))
		})
	}

	$scope.favorited = function(user){
		// console.log("USER", user);
		if (user._id !== $scope.userInfo._id){
			return ($scope.userInfo.favorites).some(function(favorite){
				return (user._id === favorite)
			})
		} else {return true}
	}

	$scope.updateSearch = function(searchTerm){
		// $scope.searchTerm = searchTerm
		console.log(searchTerm)
		if(searchTerm){
			console.log(searchTerm)
		$scope.users = $scope.users.filter(function(user){
			if (user.username.match(searchTerm)){
				return true
			} else{
				return false
			}
		})
	} else{
		$scope.users = users
	}



	}
})
