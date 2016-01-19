'use strict';

angular.module('socialMockup')


.controller('gameCtrl', function($scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray){

	//*******USERAUTH
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){$location.path('/login')}
		else{$scope.isLoggedIn = true;}
	})
	// $scope.$watch(function(){return $scope.searchTerm}, function(n,o){
	// 	$scope.updateSearch();
	// })

	$scope.isUser = function(user){
		if (user._id !== $scope.userInfo._id){
			return (false)
		} else {return true}
	}

	//******FIREBASE
	var ref = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");
	// $scope.data = $firebaseObject(ref);

	var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, "data");

	// create a synchronized array
	  $scope.messages = $firebaseArray(ref);
	  // add new items to the array
	  // the message is automatically added to our Firebase database!
	  $scope.addMessage = function(message) {
			// console.log($scope.newMessageText);
			console.log(message);
	    $scope.messages.$add({
	      text: message
	    });
	  };

});
