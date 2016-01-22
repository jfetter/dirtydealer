'use strict';

angular.module('cardsAgainstHumanity')


.controller('gameMasterCtrl', function(TimerService, $timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, CardsService, $http){

	/* ______________
	|              |
	|  User Auth:  |
	|______________| */
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

	/* ______________
	|              |
	| Card Dealing:|
	|______________| */
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


	/* ______________
	|              |
	| Firebase:    |
	|______________| */
	var playersRef = GameService.gameInstance.child("players");
	var messageRef = GameService.gameInstance.child("messages")
	var responseRef = GameService.gameInstance.child("response");
	$scope.playerss = GameService.playerss
	$scope.whiteCardRef = CardsService.whiteCardRef;
	$scope.blackCardRef = CardsService.blackCardRef;
	$scope.timerRef = TimerService.timerRef;

	$scope.myHand = [];

	$scope.numPlayers;


	/* ______________
	|              |
	|  States:     |
	|______________| */
	var currentState = '';

	if($scope.isLoggedIn){
		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies)
	}

	var gameStateRef = GameService.gameStateRef;
	//connect with firebase game states
	gameStateRef.on('value', function(snap) {
		currentState = snap.val();
		gameState();
		console.log("!!!!!game state ref!!!!!", currentState)
	})


	var gameWon = false; // link this to a node on firebase...

	var gameState = function() {

		// console.log("THIS IS THE BLACK CARD!", $scope.blackCard);
		//send a deck of black cards and white to Firebase
		// console.log("in game state function")
		// var gameStates = ['prevote', 'vote', 'postvote'];
		// var count = 0;
		var n = 60;

		if (gameWon === false){

			switch (currentState) {

				case 1:
				currentState = 1;
				console.log('CURRENT STATE IS PREVOTE');
				$scope.blackCard = 	CardsService.dealBlackCard();
				//GameService.advanceGameState();
				if (!$scope.counter){
					$scope.countDown();
				}
				break;

				case 2:
				// if (!$scope.counter){
				// 	$scope.countDown();
				// }
				console.log("!!!! VOTE !!!!")
				break;

				case 3:
				// if (!$scope.counter){
				// 	$scope.countDown();
				// }
				console.log("!!!! POSTVOTE !!!!")
				//check if game won
				break;
			}
		} else {
			console.log("execute game won sequence")

		}
		// break;
	}


	/* ______________
	|              |
	| Timer:       |
	|______________| */

	$scope.timerRef.on("value", function(snap){
		$scope.counter = snap.val();
	})

	var n = 60;
	var mytimeout = null;
	// Actual timer method, counts down every second, stops on zero.
	$scope.countDown = function() {
		//console.log("COUNTER ", n)
		console.log("COUNTER ", n)
		if(n ===  0) {
			$scope.$broadcast('timer-stopped', 0);
			$timeout.cancel(mytimeout);
			return;
		}
		n--;
		TimerService.countDown(n);
		mytimeout = $timeout($scope.countDown, 1000);
	};

	// Triggered, when the timer stops, can do something here, maybe show a visual alert.
	$scope.$on('timer-stopped', function(event, remaining) {
		if(remaining === 0) {
			//advance game to next state
			// GameService.advanceGameState();
			// gameState();

			swal({
				type: "error",
				title: "Uh-Oh!",
				text: "Next Phase is underway!",
				showConfirmButton: true,
				confirmButtonText: currentState,
			});
		}
	});

	/* ______________
	|              |
	| Players:     |
	|______________|
	*/	// Create array to store each player's info.

	if (!localStorage.thisPlayer){
		GameService.addPlayer();
	}

	//Add player to waiting room when they click join.
	playersRef.on("child_added", function() {
		$timeout(function() {
			if ($scope.playerss.length >= 3 ) {
				currentState = 1;
				CardsService.startDeck();
				$scope.myHand = GameService.pickCards();
			}
		});
	});

	//Update number of players when a player quits.
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


	/* ______________
	|              |
	| Messages:    |
	|______________| */
	$scope.messages = GameService.messages;
	$scope.addMessage = function(message) {
		GameService.addMessage(message);
		// $scope.newMessageText = "";
	}

	$scope.voteCard = function(card){
		GameService.voteCard(card);
		console.log("YOU voted for:", card)
		$scope.voted = true;
	}
	$scope.sayName = function(){
		var token = jwtHelper.decodeToken(cookies)
		console.log("TOKEN MASTER ", token)
	}


	/* ______________
	|              |
	| Responses:   |
	|______________| */



		$scope.addToVotedCards = function(cardClicked, index, sent) {
			GameService.addToVotedCards(cardClicked, index, sent);
			$scope.sent = !$scope.sent
		}
		$scope.responses = [];

		///watch firebase voting ref
		responseRef.on("value", function(snap) {
			$scope.responses = snap.val();
			console.log(snap.val(), "OUTSIDE THE IF");
			if ($scope.responses.length === $scope.playerss.length) {
				console.log(snap.val(), "INSIDE");
				gameState = 2;
			}
		});


	/* ______________
	|              |
	| Tally votes: |
	|______________| */

		///watch firebase voting ref
		// responseRef.on("value", function(snap) {
		// 	$scope.responses = snap.val();
		// 	console.log(snap.val(), "OUTSIDE THE IF");
		// 	if ($scope.responses.length === $scope.playerss.length) {
		// 		console.log(snap.val(), "INSIDE");
		// 		gameState = 2;
		// 	}
		// });


});
