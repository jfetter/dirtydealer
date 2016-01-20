'use strict';

angular.module('socialMockup')


.controller('gameMasterCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){

	//*******USERAUTH:
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){$location.path('/login')}
		else{$scope.isLoggedIn = true;}
	})

	$scope.isUser = function(user){
		if (user._id !== $scope.userInfo._id){
			return (false)
		} else {return true}
	}




	//********TIMER:
	$scope.counter = 90;
	var mytimeout = null; // the current timeoutID
	// actual timer method, counts down every second, stops on zero
	$scope.onTimeout = function() {
		if($scope.counter ===  0) {
			$scope.$broadcast('timer-stopped', 0);
			$timeout.cancel(mytimeout);
			return;
		}
		$scope.counter--;
		mytimeout = $timeout($scope.onTimeout, 1000);
	};
	$scope.startTimer = function() {
		mytimeout = $timeout($scope.onTimeout, 1000);
	};
	// stops and resets the current timer
	$scope.stopTimer = function() {
		$scope.$broadcast('timer-stopped', $scope.counter);
		$scope.counter = 90;
		$timeout.cancel(mytimeout);
	};
	// triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
	$scope.$on('timer-stopped', function(event, remaining) {
		if(remaining === 0) {
			console.log('your time ran out!');
		}
	});


	var playersRef = GameService.gameInstance.child("players");
	var messageRef = GameService.gameInstance.child("messages")
	$scope.playerss = GameService.playerss 
	$scope.numPlayers = 0;
	/////****ADD AND REMOVE PLAYERS:




	// create an array to store each player's info
	// $scope.addPlayer = function(){
	// 	GameService.addPlayer();
	// }
	if (!localStorage.thisPlayer){
		GameService.addPlayer();
	}


	//add player to waiting room when they click join
	playersRef.on("child_added", function() {
		$timeout(function() {
			$scope.numPlayers ++;
			console.log("current Players", $scope.playerss)
		});
	});

	//update number of players when a player quits
	playersRef.on("child_removed", function() {
		$timeout(function() {
			$scope.numPlayers -= 1;
			console.log("PLAYER QUIT", playersRef)
		});
	});

$scope.removePlayer = function(){
		GameService.removePlayer();
	}

	// *******MESSAGES
	$scope.messages = GameService.messages;
	$scope.addMessage = function(message) {
		GameService.addMessage(message);
	}
});
