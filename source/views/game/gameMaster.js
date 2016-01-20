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
	var gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	var playersRef = gameInstance.child("players");
	var messageRef = gameInstance.child("messages")
	$scope.playerss = $firebaseArray(playersRef);
	$scope.numPlayers = 0;

	// create an array to store each player's info
	$scope.addPlayer = function(){
		// figure out how to pull user id info ... maybe store it on rootscope?
		var thisPlayer = Date.now();
		localStorage.player = thisPlayer;
		console.log("this player logged In", localStorage.player)
		//**The next line kicks off the timer!
		mytimeout = $timeout($scope.onTimeout, 1000);
		playersRef.child(thisPlayer).set({player: thisPlayer});
	}
	if (!localStorage.thisPlayer){
		$scope.addPlayer();
	}

		//remove players
$scope.removePlayer = function(){
    var player = JSON.parse(localStorage.player);
		console.log("player to remove", player);
		playersRef.child(player).remove();
		console.log("players before remove", $scope.playerss)
		localStorage.removeItem("player");
		console.log("players after remove", $scope.playerss)
		$state.go("userPage");
	}


	playersRef.on("child_added", function() {
		$timeout(function() {
			$scope.numPlayers ++;
		});
	});

	//update number of players when a player quits
	playersRef.on("child_removed", function() {
		$timeout(function() {
			$scope.numPlayers -= 1;
			console.log("PLAYER QUIT", playersRef)
		});
	});

//initialize new game
$scope.launchNewGame = function(){
	$scope.numPlayers = 0;
	console.log("NEW GAME");
}
	//add player to waiting room when they click join
	if ($scope.numPlayers < 3 ){
		$scope.phase = "waitingForPlayers";
		} else {
		$scope.launchNewGame();
	}




	// *******MESSAGES
	$scope.messages = $firebaseArray(messageRef);
	$scope.addMessage = function(message) {
		console.log(message);
		$scope.messages.$add({
			text: message
		});
	};
});
