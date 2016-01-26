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
		if (res.data === "authRequired"){
			console.log("AUTH REQUIRED")
			$location.path('/login')
		}else{
			$scope.isLoggedIn = true;}
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
	|Utility Functs|
	|______________| */



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
	var winVotes = GameService.votes;
	// $scope.blackCard = scenarioCardRef

	/* ______________
	|              |
	|  States:     |
	|______________| */


	var gameState = function(thisState) {

			switch (thisState) {

				case 1:
				$rootScope.voted = false;

				//ng-hide all the cards submitted for vote
				break;

				case 2:
					console.log("STATE 2 VOTE !!!!!")

				// ng-show all the cards that are submitted for voting
				// ng-disable clickable cards from your deck
				break;

				case 3:
				console.log("!!!! POSTVOTE !!!!")
				votesRef.remove();
				responseRef.remove();
				scenarioCardRef.remove();
				myRef.child('voted').remove();
				myRef.child('submittedResponse').remove();
				GameService.drawOneCard();
				CardsService.dealBlackCard();
				gameStateRef.set(1)
				break;
			}

		}


	//connect with firebase game states
	gameStateRef.on('value', function(snap) {
		// if (){
		// 	return; 
		// }
		console.log("GAME REF JUST CHANGED TO: ", snap.val())
		var thisState = snap.val();
		$scope.currentState = thisState;
		gameState(thisState);
	})


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
			if ($scope.haveSubmitted != true && $scope.currentState === 1){
				//console.log("you should have submitted by now")
				//console.log("My hand", $scope.myHand )
				var rando = Math.floor((Math.random() * $scope.myHand.length ) + 0);
				var spliced = $scope.myHand.splice(rando, 1)
				spliced = spliced[0];
				//console.log("spliced", spliced, "rando", rando);
				GameService.addToResponseCards(spliced, rando)
				myRef.child('cards').set($scope.myHand);
				myRef.child('submittedResponse').set(true) 
			}
			console.log("ROOTSCOPE voted", $rootScope.voted)
				var otherPlayers = [];
			if ($rootScope.voted != true && $scope.currentState === 2){
				console.log($scope.playerss)
				$scope.playerss.forEach(function(player){
					if(player != myId){
						otherPlayers.push(player)
					}
				})
					var rando = Math.floor((Math.random() * otherPlayers.length ) + 0);
					var spliced = otherPlayers.splice(rando, 1)
					spliced = spliced[0].playerId;
					winVotes.$add(spliced)	
					console.log("YOU VOTE FOR", spliced)
			} 
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

//Will not reset your player info by logging you in if you are already in
thisGame.once('value', function(snap){
		console.log("snap.VAL() IN THIS GAME ONCE)", snap.val())
	if (snap.val() === null){
		GameService.addPlayer();
		return;
	} 
		var players = snap.val().players;
		console.log("PLAYERS", players);
	if (players.hasOwnProperty(myId) === false){
		GameService.addPlayer();
		console.log("LOGGING IN ONCE")
		return;
	} else{
		console.log("NOT LOGGING IN TWICE")
		return;
	}

})

	//Add player to waiting room when they click join.
	playersRef.on("child_added", function() {
		$timeout(function() {
			//&& $scope.currentState === undefined
			if ($scope.playerss.length === 3 && !$scope.currentState) {
				console.log("STARTING GAME", $scope.playerss)
	
				CardsService.startDeck();
				CardsService.dealBlackCard();
				GameService.pickCards();
				TimerService.countDown();
				gameStateRef.set(1);
			} else if ($scope.playerss.length < 3){
				console.log("THE current Playas:", $scope.playerss)
				return;
			} else {
				///launch new game
			}
		});
	});

	playersRef.on("child_removed", function(snap) {
	//Update number of players when a player quits?
	//SWAL XXX HAS LEFT THE GAME;
		console.log("PLAYER QUIT", snap.val())
	});

	$scope.removePlayer = function(){
		GameService.removePlayer();
		$state.go("userPage");
	}

	/* ______________
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

	/* ______________
	|              |
	| Responses:   |
	|______________| */

// notify firebase that I submitted a response card
	responseRef.on('child_added', function(snap){
		var responses = snap.val();
		console.log("RESPONSE REF IS NOW",responses)
		if(responses.hasOwnProperty(myId)){
			console.log("I SUBMITTED A RESPONSE!")
			myRef.update({
				submittedResponse: true
			})
		}
	})

//update the scope when I submit a response card
	myRef.child('submittedResponse').on('value', function(snap){
		//console.log(snap.val(), "SNAP VAL IN SUBMITTD RESPONSE")
		//console.log("$scope.haveSubmitted", $scope.haveSubmitted)
		$scope.haveSubmitted = snap.val();
	})

	responseRef.on("child_added", function(snap) {
		var numResponses = snap.numChildren();
		var allResponses = snap.val();
		$scope.responses = snap.val();
		console.log("ALL RESPONSES", allResponses)
		// if (allResponses.hasOwnProperty(myId))
		// 	{
		// 		console.log("I SUBMITTED!")
		// 		myRef.child()
		// 		// to account for refreshing could set this as
		// 		// a key in the player schema; 
		// 	}
		//console.log(snap.val(), "OUTSIDE THE IF");
		if (numResponses === $scope.playerss.length && numResponses > 0) {
			console.log(snap.val(), "INSIDE");
		//start timer for next round;
			TimerService.counter = 61;
			TimerService.countDown();
			gameStateRef.set(2);
		}
	});

	/* ______________
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
		console.log(cardClicked)
		GameService.addToResponseCards(cardClicked, index);
	}

	votesRef.on("child_added", function(snap) {
		//$scope.haveVoted = true;
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
				showConfirmButton: true,
				confirmButtonText: "sweet!",
			});
	})



	/* ______________
	|              |
	| Messages:    |
	|______________| */
	$scope.messages = GameService.messages;
	$scope.addMessage = function(message) {
		GameService.addMessage(message);
		// $scope.newMessageText = "";
	}



});
