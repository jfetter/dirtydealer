'use strict';

angular.module('cardsAgainstHumanity')


.controller('userPageCtrl', function($scope, $rootScope, $state, GameService, UserService, $cookies, jwtHelper, $location , $base64){
	
	var rootRef = GameService.rootRef
	var gameList = rootRef.child('games');
	//force game value to change on refresh page
	rootRef.child("force").update({force: "force"});
	rootRef.child('force').remove();
	$rootScope.gameSize = $scope.gameSize; 


	$scope.user = {};
	$scope.editPayload = {};
	var cookies = $cookies.get('token');
	var token = jwtHelper.decodeToken(cookies)
	UserService.isAuthed(cookies)
	.then(function(res , err){
		 if (res.data === "authRequired"){
			 $location.path('/login')
		 } else{$scope.isLoggedIn = true;}
	})

	UserService.page($state.params.username)
	.then(function(res) {
		//console.log(res.data.ddWins);
		$scope.user = res.data;
		$scope.user.gamePoints = res.data.ddWins;
		$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
		$scope.isEditing = false;
		$scope.editPayload.username = $scope.user.username;
		$scope.editPayload._id = $scope.user._id
		console.log('scope user username: ', $scope.user.username);
    if(res.data.avatar){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`
    } else {
      $scope.profileImageSrc = 'http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg'
    }

	}, function(err) {
		console.error(err)
	});

	$scope.toggleEdit = function(){
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		UserService.editAccount($scope.editPayload)
		.then(function(response){
			$scope.$emit('edit', response.data)
			$scope.user = response.data;
			$scope.isEditing = !$scope.isEditing;
		})
	}

  $scope.uploadImage = function(image){
    UserService.uploadImage(image, $scope.user._id)
    .then(function(res){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;
    })
  }

	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
});
