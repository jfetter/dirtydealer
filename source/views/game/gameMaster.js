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


	var playersRef = GameService.gameInstance.child("players");
	var messageRef = GameService.gameInstance.child("messages")
	$scope.playerss = GameService.playerss 

	$scope.numPlayers = $scope.playerss.length;
	/* ______________
	|              |
	|  States:     |
	|______________| */




	var currentState = '';

	var gameState = function() {
		console.log("in game state function")
		var gameStates = ['prevote', 'vote', 'postvote'];
		var count = 0; 
		currentState = gameStates[count]
		switch (currentState) {

			case 'prevote':
  		//need an '&&' no white card has been selected?
			mytimeout = $timeout($scope.onTimeout, 1000);
			currentState = 'prevote';
			console.log('CURRENT STATE IS PREVOTE');
			// break;
		

	}
}

	//initialize new game or display waiting room
 if ($scope.numPlayers < 3 ){
 		console.log("less than 3 players")
 		//$scope.phase = "waitingForPlayers";
 		} else {
 		gameState();
 	}


//********TIMER:
$scope.counter = 60;
var mytimeout = null; // the current timeoutID
// Actual timer method, counts down every second, stops on zero.
$scope.onTimeout = function() {
	if($scope.counter ===  0) {
		$scope.$broadcast('timer-stopped', 0);
		$timeout.cancel(mytimeout);
		return;
	}
	$scope.counter--;
	mytimeout = $timeout($scope.onTimeout, 1000);
};

// Triggered, when the timer stops, can do something here, maybe show a visual alert.
$scope.$on('timer-stopped', function(event, remaining) {
	if(remaining === 0) {
		swal({
			type: "error",
			title: "Uh-Oh!",
			text: "Time is up.",
			showConfirmButton: true,
			confirmButtonText: "Ok.",
		});
	}
});

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
		$state.go("userPage");
	}

	// *******MESSAGES
	$scope.messages = GameService.messages;
	$scope.addMessage = function(message) {
		GameService.addMessage(message);
	}
});
