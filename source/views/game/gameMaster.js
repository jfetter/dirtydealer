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

		var cardsRef = GameService.gameInstance.child("cards");

		// playersRef.child(myId).on('value', function(snap){
		// 	console.log("I EVLOLVED", snap.val().cards.length)
		// })
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
				myRef.child('tempHand').remove();
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
				$scope.counter = 60;
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: "Next Phase is underway!",
					showConfirmButton: true,
					confirmButtonText: "GET GOIN' ",
				});
			}
		});

		/* ______________
		|              |
		| Players:     |
		|______________|
		*/

		// upon login or refresh page
		thisGame.once('value', function(snap){

			if(snap.val() == null){
				CardsService.startDeck();
				CardsService.dealBlackCard();
				$timeout(function(){
					GameService.addPlayer()
				},100)
			} else {
				var players = snap.val().players;
				console.log("PLAYERS", players);
				if (players.hasOwnProperty(myId) === false){
					console.log("I JUST GOT ADDED");
					GameService.addPlayer();
					return;
				}
				$scope.counter === TimerService.counter;
				$scope.playerss = [];
				for (var player in players){
					$scope.playerss.push(player);
				}
				console.log(players[myId].cards);
				$scope.myHand = players[myId].cards;
			}
		})


		// playersRef.child(myId).once('child_added', function(snap) {
		// 	if(!snap.val().cards){
		// 		console.log("You have cards now");
		// 	} else {
		// 		console.log("You already have cards");
		// 	}
		// })
		//Will not reset your player info by logging you in if you are already in
		// thisGame.once('value', function(snap){
		// 		console.log("snap.VAL() IN THIS GAME ONCE)", snap.val())
		// 	// if (snap.val() === null){
		// 	// 	GameService.addPlayer();
		// 	// 	return;
		// 	// }
		// 		var players = snap.val().players;
		// 		console.log("PLAYERS", players);
		// 	if (players.hasOwnProperty(myId) === false){
		// 		GameService.addPlayer();
		// 		console.log("LOGGING IN ONCE")
		// 		return;
		// 	} else{
		// 		console.log("NOT LOGGING IN TWICE")
		// 		return;
		// 	}

		// })

		//Add player to waiting room when they click join.


		playersRef.on("value", function(snap) {
			//&& $scope.currentState === undefined
			var players = snap.val();
			var numPlayers = snap.numChildren();
			console.log("playas gonna play play play play play", players)
			if (numPlayers === 3 && !$scope.currentState) {
				$scope.counter = 60;
				console.log("STARTING GAME", $scope.playerss)
				TimerService.countDown();
				gameStateRef.set(1);
			} else if ($scope.playerss.length < 3){
				console.log("THE current Playas:", $scope.playerss)
				return;
			} else {
				return;
			}
		});

		playersRef.on("child_removed", function(snap) {
			//alert("PLAYER QUIT", snap.val())
			if ($scope.playerss.length === 0 ){
				GameService.gameInstance.set(null);
			} else if ( $scope.playerss.length ===1){
				GameService.gameInstance.set(null);
				$timeout(function() {
					location.reload(true);
				}, 500);
			}
			return;
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

		//$scope.myHand = [];


		myRef.child('cards').on('value', function(snap){
			$scope.myHand = snap.val();
		});

		scenarioCardRef.on("value", function(snap) {
			$scope.blackCard = snap.val();
		});

		/* _____________
		|              |
		| Responses:   |
		|______________| */

		// notify firebase that I submitted a response card
		//responseRef.on('child_added', function(snap){

		//})
		$scope.addToResponseCards = function(cardClicked, index) {
			console.log("cardClicked", cardClicked)
			GameService.addToResponseCards(cardClicked, index);
		}

		//update the scope when I submit a response card
		myRef.child('submittedResponse').on('value', function(snap){
			//console.log(snap.val(), "SNAP VAL IN SUBMITTD RESPONSE")
			//console.log("$scope.haveSubmitted", $scope.haveSubmitted)
			$scope.haveSubmitted = snap.val();
		})

		responseRef.on("value", function(snap) {
			var allResponses = snap.val();
			var numResponses = snap.numChildren();
			$scope.responses = snap.val();
			console.log("RESPONSE REF IS NOW",allResponses)
			console.log("$scope.playerss.length", $scope.playerss.length)
			if (allResponses != null){
				if(allResponses.hasOwnProperty(myId)){
					console.log("I SUBMITTED A RESPONSE!")
					myRef.update({
						submittedResponse: true
					})
				}
			}
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

		votesRef.on("value", function(snap) {
			//$scope.haveVoted = true;
			var votes = snap.val();
			console.log($scope.votes);
			var votesLength = snap.numChildren();
			console.log(votesLength, "VOTES OUTSIDE THE IF IN VOTES");
			if (votesLength == $scope.playerss.length && votesLength > 0) {
				console.log("INSIDE VOTES")
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

				winner.forEach(function(player, card){
					var player = player.player;
					console.log(player, "GETS A POINT !!!!")
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
			} // end votes === playerss length
		});



		/* ______________
		|              |
		| Winner!			 |
		|______________| */

		thisGame.child('winner').on('child_added', function(snap){
			var winner = snap.val();


			console.log(winner, "THIS IS THE WINNER");
			// var winningBlackCard = thisGame.child('scenarioCard').text();
			// var winningWhiteCard = thisGame.child()
			console.log("snap.val().winnerName", snap.val().winnerName);

			console.log(winner, "THIS IS THE WINNER CARD AHhHHHHHHHH");
			//Play Again refreshes game page & clears out old data.
			//Quit Game redirects to userpages & removes player from game.
			swal({
				title: "<b> And the winner is... </b>",
				text: winner,
				html: true,

				type: "success",
				animation: "slide-from-top",
				showCancelButton: true,
				cancelButtonText: "Play Again",
				closeOnConfirm: true,
				showLoaderOnConfirm: true,
				showConfirmButton: true,
				confirmButtonText: "Cool. I'm done."
			}, function(isConfirm) {
				if (isConfirm) {
					var cookies = $cookies.get('token');
					var username;
					if(cookies){
						$scope.userInfo = (jwtHelper.decodeToken(cookies))
					}
					GameService.gameInstance.set(null);
					$timeout(function() {
						$scope.removePlayer()

						// GameService.removePlayer();
						$state.go('userPage', {"username": username})
						console.log("REMOVED PLAYER");
						// }
					}, 500)
				} else {
					$timeout(function() {
						location.reload(true);
					}, 500)
				};
			});
			return;
		});



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
