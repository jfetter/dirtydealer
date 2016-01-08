'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64){
	$scope.user = {};
	$scope.editPayload = {};
	var cookies = $cookies.get('token');
	var token = jwtHelper.decodeToken(cookies)
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;
		 }
	})
	UserService.page($state.params.username)
	.then(function(res) {
		console.log("PARAMS", $state.params.name)
		console.log(res.data.favorites)
		$scope.user = res.data;
		$scope.favorites = res.data.favorites;
		$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
		$scope.isEditing = false;
		$scope.editPayload.username = $scope.user.username;
		$scope.editPayload.email = $scope.user.email;
		$scope.editPayload.phone = $scope.user.phone;
		$scope.editPayload.name = $scope.user.name
		$scope.editPayload.address = $scope.user.address
		$scope.editPayload._id = $scope.user._id
    console.log($scope.isEditing)
		console.log("edit Payload", $scope.editPayload)
		console.log('token:',token);
		console.log('scope user username: ', $scope.user.username);
    if(res.data.avatar){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`
    } else {
      $scope.profileImageSrc = `http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg`
    }

	}, function(err) {
		console.error(err)
	});
  $scope.test = function(){
    console.log("TESTING")
  }
	$scope.removeFavorite = function (userId){
		UserService.unFavoriteUser(userId)
		.then(function(res){
			$scope.userInfo = (jwtHelper.decodeToken(res.data))
			var cookie = $cookies.get('token');
			var token = jwtHelper.decodeToken(cookie);
			console.log(token)
			$scope.favorites = token.favorites;
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

	$scope.toggleEdit = function(){
    console.log($scope.isEditing)
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		UserService.editAccount($scope.editPayload)
		.then(function(res){
			$scope.user = res.data;
			$scope.isEditing = !$scope.isEditing;
			console.log(res.data)
		})

	}

  $scope.uploadImage = function(image){
    console.log(image)
    UserService.uploadImage(image, $scope.user._id)
    .then(function(res){
      console.log(res.data)
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;
      console.log($scope.profileImageSrc)

    })

  }

	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})

});
