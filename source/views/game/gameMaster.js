'use strict';

angular.module('cardsAgainstHumanity')


.controller('gameMasterCtrl', function(TimerService, $timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, CardsService, $http){
	// var currentState = '';

	/* ______________
	|              |
	|  User Auth:  |
	|______________| */
	var myId	= ''
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
		myId = $scope.userInfo._id;
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


	if($scope.isLoggedIn){
		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies)
	}

	$scope.sayName = function(){
		var token = jwtHelper.decodeToken(cookies)
		console.log("TOKEN MASTER ", token)
	}

	/* ______________
	|              |
	| Firebase:    |
	|______________| */
	var thisGame = GameService.gameInstance
	var playersRef = GameService.gameInstance.child("players");
	var messageRef = GameService.gameInstance.child("messages")
	var responseRef = GameService.gameInstance.child("response");
	$scope.playerss = GameService.playerss
	$scope.whiteCardRef = CardsService.whiteCardRef;
	$scope.blackCardRef = CardsService.blackCardRef;
	$scope.timerRef = TimerService.timerRef;
	var myRef = playersRef.child(myId);
	$scope.scenarioCardRef = CardsService.gameInstance.child("scenarioCard")
	var scenarioCardRef = CardsService.gameInstance.child("scenarioCard")
	var gameStateRef = GameService.gameStateRef;
	var votesRef = GameService.gameInstance.child("votes");

	var cardsRef = GameService.gameInstance.child("cards");

	// playersRef.child(myId).on('value', function(snap){
	// 	console.log("I EVLOLVED", snap.val().cards.length)
	// })
	// $scope.blackCard = scenarioCardRef

	/* ______________
	|              |
	|  States:     |
	|______________| */


	var gameState = function(thisState) {

		switch (thisState) {

			case 1:

			console.log("HERE I AM!", myId);

			// if(!playersRef.child(myId).hasOwnProperty('cards')){
			// 	// GameService.pickCards();s
			// 	console.log("DREW A HAND!")
			// }

			$rootScope.voted = false;
			if ($scope.counter === 60){
				//TimerService.countDown();
			}else if (!$scope.haveSubmitted){
				// auto select a card to go to responses
			}
			//}
			//ng-hide all the cards submitted for vote
			break;

			case 2:
			console.log("STATE 2 VOTE !!!!!")
			if($scope.counter === 60){
				//TimerService.countDown();
			} else if (!$scope.haveVoted){
				// auto select a card to vote for
			}
			// ng-show all the cards that are submitted for voting
			// ng-disable clickable cards from your deck
			break;

			case 3:
			console.log("!!!! POSTVOTE !!!!")
			votesRef.remove();
			responseRef.remove();
			scenarioCardRef.remove();
			GameService.drawOneCard();
			CardsService.dealBlackCard();
			gameStateRef.set(1)
			break;
		}

	}


	//connect with firebase game states
	gameStateRef.on('value', function(snap) {
		console.log("GAME REF JUST CHANGED TO: ", snap.val())
		var thisState = snap.val();
		$scope.currentState = thisState;
		gameState(thisState);
	})

	// 	_______________
	// |	             |
	// |	Debug:       |
	// |_______________|

	$scope.summonDeck = function(){
		console.log("I DID IT, RIGHT?")
		CardsService.startDeck();
	}
	$scope.summonHand = function(){
		console.log("I DID IT, RIGHT?")
		GameService.pickCards();
		console.log("FALSE?", playersRef.child(myId).hasOwnProperty('cards'));
	}

	$scope.selfDestruct = function(){
		gameStateRef.remove();
		GameService.killAll();
		CardsService.killCards();
	}



	/* ______________
	|              |
	| Timer:       |
	|______________| */

	$scope.timerRef.on("value", function(snap){
		$scope.counter = snap.val();
	})

	// Triggered, when the timer stops, can do something here, maybe show a visual alert.
	$scope.$on('timer-stopped', function(event, remaining) {
		if(remaining === 0) {
			swal({
				type: "error",
				title: "Uh-Oh!",
				text: "Next Phase is underway!",
				showConfirmButton: true,
				confirmButtonText: "GET GOIN' ",
			});
			remaining = false;
			$scope.counter = 60;
		}
	});

	/* ______________
	|              |
	| Players:     |
	|______________|
	*/	// Create array to store each player's info.

	///NEED TO LIMIT TO ADDING ONLY ONCE...UNLESS SET HANDLES THAT?
	GameService.addPlayer();



	// playersRef.once('child_added', function() {
	// 	CardsService.startDeck();
	// 	CardsService.dealBlackCard();
	// })
	// GameService.pickCards();

	//Add player to waiting room when they click join.

	console.log("FALSE?", playersRef.child(myId).hasOwnProperty('username'));
	// if(!scenarioCardRef.hasOwnProperty('text')){
	// 	console.log("Populating", );
	// 	CardsService.startDeck();
	// 	CardsService.dealBlackCard();
	// }


	playersRef.on("child_added", function() {
		if(!playersRef.child(myId).hasOwnProperty('cards')){
			console.log("YOU HAVE NO CARDS!");
			// GameService.pickCards();
			// console.log("DREW A HAND!")
		} else {
			console.log("YOU HAVE CARDS");
		}
		$timeout(function() {
			//&& $scope.currentState === undefined
			if ($scope.playerss.length === 2 && !$scope.gameState) {
				$scope.counter = 60;
				gameStateRef.set(1);
				console.log("THE Playas:", $scope.playerss)
			} else if ($scope.playerss.length < 2){
				console.log("THE current Playas:", $scope.playerss)
				return;
			} else {
				return;
			}
		});
	});

	playersRef.on("child_removed", function(snap) {
		//Update number of players when a player quits?
		console.log("PLAYER QUIT", snap.val())
	});

	$scope.removePlayer = function(){
		GameService.removePlayer();
		$state.go("userPage");
	}

	/* _____________
	|              |
	| cards        |
	|______________| */
	// maybe need to play around with child_added/ child_removed
	// to prevent re-deals?

	$scope.myHand = [];

	myRef.child('cards').on('value', function(snap){
		$scope.myHand = snap.val();
		//console.log("MY SCOPE CARDS ARE", $scope.myHand);
	});

	scenarioCardRef.on("value", function(snap) {
		$scope.blackCard = snap.val();
	});

	/* _____________
	|              |
	| Responses:   |
	|______________| */

	responseRef.on("value", function(snap) {
		$scope.responses = snap.val();
		var numResponses = snap.numChildren();
		console.log(snap.val(), "OUTSIDE THE IF");
		if (numResponses === $scope.playerss.length && numResponses > 0) {
			console.log(snap.val(), "INSIDE");
			$scope.haveSubmitted = true;
			gameStateRef.set(2);
		}
	});

	/* _____________
	|              |
	| Votes:   		 |
	|______________| */




	$scope.voteCard = function(card){
		if ($rootScope.voted === true || $scope.currentState !== 2){
			console.log("YOU ALREADY VOTED")
			return;
		}
		console.log("IN VOTECARD", card)
		// votesRef.on("child_added", function(snap){
		// var card = snap.val();
		// console.log("CARD ",card);
		// console.log("my ID", myId);
		if (card.player === myId){
			console.log('YOU CANNOT VOTE FOR YOURSELF');
			votesRef.child(myId).remove();
			swal({
				type: "error",
				title: "Wow, someone thinks they're special",
				text: "Choose someone else's response",
				showConfirmButton: true,
				confirmButtonText: "Choose Again",
			});
		} else {
			$rootScope.voted = true;
			console.log("I AM ROOT:", $rootScope.voted)
			GameService.voteCard(card);
		}
		// })
		//console.log("YOU voted for:", card)
		//$rootScope.voted = true;
	}

	$scope.addToResponseCards = function(cardClicked, index) {
		GameService.addToResponseCards(cardClicked, index);
	}

	votesRef.on("value", function(snap) {
		$scope.haveVoted = true;
		var votes = snap.val();
		var votesLength = snap.numChildren();
		console.log(votesLength, "VOTES OUTSIDE THE IF IN VOTES");
		//console.log(votesLength, "VOTES CHILDREN")
		if (votesLength === $scope.playerss.length && votesLength > 0) {
			var votesCast = {};
			for(var player in votes){
				player = votes[player];
				if (!votesCast[player]){
					votesCast[player] = 1;
				} else {
					votesCast[player] ++;
				}
				console.log(votesCast, "*.*. VOTES CAST *,*,");
			}
			var winner = [];
			var prev = 0;
			for (var player in votesCast){
				if (votesCast[player] >= prev){
					var person = {}
					person.player = player;
					person.points = votesCast[player];
					winner.pop();
					winner.push(person);
					prev = votesCast[player];
				}
			}
			console.log("*.*.*.* WINNER ARRAY *.*.*.*", winner);

			winner.forEach(function(player){
				var player = player.player;
				console.log(player, "GETS A POINT !")
				GameService.addWinPoint(player);
				// playersRef.child(player).on('value', function(snap){
				// 	var thisPlayer = snap.val()
				// 	swal({
				// 		type: "error",
				// 		title: "this round goes to",
				// 		text: thisPlayer.username,
				// 		showConfirmButton: true,
				// 		confirmButtonText: "sweet!",
				// 	});
				//})
			})
		}
	});



	/* ______________
	|              |
	| Winner!			 |
	|______________| */

	thisGame.child('winner').on('child_added', function(snap){
		//need to set up play again / quit options
		//quit redirects to profile page view and play again does
		// location.reload();
		var winner = snap.val();
		console.log("WINNER", snap.val().winnerName);

		swal({
			type: "error",
			title: "And the winner is...",
			text: winner,
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Now let's destroy the world together!",
			closeOnConfirm: false
		},function(){
			$scope.selfDestruct();
		}
	);
})



/* _____________
|              |
| Messages:    |
|______________| */
$scope.messages = GameService.messages;
$scope.addMessage = function(message) {
	GameService.addMessage(message);
	// $scope.newMessageText = "";
}



});
