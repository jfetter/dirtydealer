'use strict';

angular.module('socialMockup')


.controller('gameMasterCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, CardsService, $http){



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

	$scope.startDeck = function(){
		CardsService.startDeck();
	}
	$scope.dealBlackCard = function(){
		CardsService.dealBlackCard();
	}
	$scope.startingHand = function(){
		CardsService.startingHand();
	}
	$scope.draw = function(n){
		CardsService.draw(n);
	}

	var playersRef = GameService.gameInstance.child("players");
	var messageRef = GameService.gameInstance.child("messages")
	$scope.playerss = GameService.playerss
	$scope.whiteCardRef = CardsService.whiteCardRef;
	$scope.blackCardRef = CardsService.blackCardRef;
	$scope.votingdRef = CardsService.votingRef;
	$scope.myHand = [];

	$scope.numPlayers;
	/* ______________
	|              |
	|  States:     |
	|______________| */




	var currentState = '';

	var gameState = function() {
		CardsService.startDeck();
		//send a deck of black cards and white to Firebase
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
			$scope.myHand = GameService.pickCards();

			// break;



		}
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
			console.log("current Players", $scope.playerss)
			console.log("player Joined", $scope.playerss)
			if ($scope.playerss.length >= 3) {
				console.log("WE FUCKING KNOW ITS THREE MAN");
				gameState();
			}
		});
	});

	//update number of players when a player quits
	playersRef.on("child_removed", function() {
		$timeout(function() {
			console.log("PLAYER QUIT", playersRef)
			$scope.numPlayers = $scope.playerss.length
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



	//VOTING:
	$scope.addToVotedCards = function(cardClicked, index) {
		$scope.myHand	= GameService.addToVotedCards(cardClicked, index);
	}

});
