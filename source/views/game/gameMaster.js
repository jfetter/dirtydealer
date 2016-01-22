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
	var currentState = '';

	if($scope.isLoggedIn){
		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies)
	}

	var gameState = function() {
		CardsService.startDeck();
		$scope.blackCard = 	CardsService.dealBlackCard();
		console.log("THIS IS THE BLACK CARD!", $scope.blackCard);
		//send a deck of black cards and white to Firebase
		console.log("in game state function")
		var gameStates = ['prevote', 'vote', 'postvote'];
		var count = 0;
		var n = 60;
		currentState = gameStates[count]
		switch (currentState) {

			case 'prevote':
			currentState = 'prevote';
			console.log('CURRENT STATE IS PREVOTE');
			$scope.myHand = GameService.pickCards();
			if (!$scope.counter){
				$scope.countDown();
			}

		}
		// break;
		}

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
			swal({
				type: "error",
				title: "Uh-Oh!",
				text: "Time is up.",
				showConfirmButton: true,
				confirmButtonText: "Ok.",
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
			console.log("current Players", $scope.playerss)
			console.log("player Joined", $scope.playerss)
			if ($scope.playerss.length >= 3) {
				console.log("WE FUCKING KNOW ITS THREE MAN");
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


	$scope.addToVotedCards = function(cardClicked, index, sent) {
		// $scope.myHand	= GameService.addToVotedCards(cardClicked, index, sent);
		GameService.addToVotedCards(cardClicked, index, sent);
		$scope.sent = !$scope.sent


	/* ______________
	|              |
	| Votes:       |
	|______________| */

	}
	$scope.votes = [];
	votingRef.on("value", function(snap) {
		$scope.votes = snap.val();
		console.log(snap.val(), "duddbjddjbdjbkdbdk");
	});
});
