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
	$scope.playerss = GameService.playerss
	$scope.whiteCardRef = CardsService.whiteCardRef;
	$scope.blackCardRef = CardsService.blackCardRef;
	$scope.timerRef = TimerService.timerRef;
	var votingRef =  new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/voting");
	// GameService.gameInstance.child("voting");

	$scope.myHand = [];

	$scope.numPlayers;


	/* ______________
	|              |
	|  States:     |
	|______________| */
	$scope.currentState = '';

	if($scope.isLoggedIn){
		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies)
	}

	var gameStates = ['prevote', 'vote', 'postvote'];
	$scope.currentState;


	//connect with firebase game states
	var gameStateRef = GameService.gameStateRef;
	gameStateRef.on('value', function(snap){
		$scope.currentState = gameStates[snap.val()];
		console.log("!!!!!game state ref!!!!!", $scope.currentState)
	})

	var gameWon = false; // link this to a node on firebase...

	var gameState = function() {
		CardsService.startDeck();
		$scope.blackCard = 	CardsService.dealBlackCard();
		// console.log("THIS IS THE BLACK CARD!", $scope.blackCard);
		//send a deck of black cards and white to Firebase
		console.log("in game state function")
		var gameStates = ['prevote', 'vote', 'postvote'];
		var count = 0;
		// console.log("in game state function")
		// var gameStates = ['prevote', 'vote', 'postvote'];
		// var count = 0;
		var n = 60;

		if (gameWon === false){

			switch ($scope.currentState) {

				case 'prevote':
				$scope.currentState = 'prevote';
				console.log('CURRENT STATE IS PREVOTE');
				$scope.myHand = GameService.pickCards();
				//GameService.advanceGameState();
				//ng-hide all the cards submitted for vote
				if (!$scope.counter){
					$scope.countDown();
				}
				break;

				case 'vote':
					$scope.countDown();
				console.log("!!!! VOTE !!!!")
				// ng-show="currentState === vote"
				// ng-show all the cards that are submitted for voting
				// ng-disable clickable cards from your deck
				break;

				case 'postvote':
				console.log("!!!! POSTVOTE !!!!")
				//check if game won returns true...
				break;
			}

		} else {
			console.log("execute game won sequence")
			return;
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
			$scope.timerRef.remove();
			GameService.advanceGameState();
			gameState();
			swal({
				type: "error",
				title: "Uh-Oh!",
				text: "Next Phase is underway!",
				showConfirmButton: true,
				confirmButtonText: $scope.currentState,
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
			//&& $scope.currentState === undefined
			if ($scope.playerss.length >= 3 ) {
				$scope.currentState = 'prevote';
				gameState();
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


	$scope.addToVotedCards = function(cardClicked, index) {
		$scope.myHand	= GameService.addToVotedCards(cardClicked, index);

		$scope.addToVotedCards = function(cardClicked, index, sent) {
			// $scope.myHand	= GameService.addToVotedCards(cardClicked, index, sent);
			GameService.addToVotedCards(cardClicked, index, sent);
			$scope.sent = !$scope.sent
		}
		$scope.votes = [];
		votingRef.on("value", function(snap) {
			$scope.votes = snap.val();
			console.log(snap.val(), "duddbjddjbdjbkdbdk");
		});
	};
});
