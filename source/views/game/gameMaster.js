'use strict';

angular.module('cardsAgainstHumanity')


.controller('gameMasterCtrl', function(TimerService, $timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, CardsService, $http){

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
		$scope.whiteCardRef = CardsService.whiteCardRef;
		$scope.blackCardRef = CardsService.blackCardRef;
		var myRef = playersRef.child(myId);
		$scope.scenarioCardRef = CardsService.gameInstance.child("scenarioCard")
		var scenarioCardRef = CardsService.gameInstance.child("scenarioCard")
		var gameStateRef = GameService.gameStateRef;
		var votesRef = GameService.gameInstance.child("votes");
		var cardsRef = GameService.gameInstance.child("cards");
		var winVotes = GameService.votes;
		$scope.playerss = GameService.playerss

		/* ______________
		|              |
		| Players:     |
		|______________|
		*/

		if ($scope.playerss === null || $scope.playerss === undefined ){
			$scope.playerss = [];
		} else{
			var players = [];
			for (var player in $scope.playerss){
				players.push(player);
			}
			$scope.playerss = players;
		}

		// anytime something changes... check in with the scope
		thisGame.once('value', function(snap){
			// start the game if it hasnt started
			// then add you to waiting state
			if(snap.val() == null){
				CardsService.startDeck();
				$timeout(function(){
					GameService.addPlayer()
					//DEAL BLACK CARD HERE?
				},100)
			} else {
				// so the game exists...
				// let the scope know what gamestate it is
				// this should show all cards
				if( snap.val().gamestate != null){
					$scope.currentState = snap.val().gamestate;
				}
				// // if there is no black card deal one
				if(!snap.val().cards.scenarioCard){
					CardsService.dealBlackCard();
					console.log("CARD GENERATION METHOD 3 COMPLETE!")
				}
				if (!snap.val().players){
					GameService.addPlayer();
				}
				var players = snap.val().players;
				console.log("PLAYERS", players);
				// if you are not in the game, add you.
				if (players.hasOwnProperty(myId) === false){
					GameService.addPlayer();
					console.log("I JUST GOT ADDED");
				}
			}
		})

		// each time timer ticks firebase will check on game
		thisGame.on('value', function(snap){
			console.log(snap.val())
			var snap = snap.val();
			$scope.currentState = snap.gamestate;
			if (snap === null){
				return;
			}
			if ($scope.playerss === null || $scope.playerss === undefined ){
				$scope.playerss = [];
			} else{
				//$scope.playerss = players;
			}
			console.log("PLAYERSSSSSSSSSS",  $scope.playerss)
			//make sure you can see	response cards
			if (snap.response != null){
				$scope.responses = snap.response
			}
			// make sure you can see your hand
			$scope.myHand = snap.players[myId].cards;
			//console.log("MY HAND", $scope.myHand);
			//make sure you can see the black card
			$scope.blackCard = snap.cards.scenarioCard;
		})

		//Any time someone leaves or joins the game check in with F.B.
		playersRef.on("value", function(snap) {
			var players = [];
			snap.forEach (function(player){
				players.push(player.val());
				console.log("pushing", player.val(), "into the game")
			});
			$scope.playerss = players;
			console.log("playas gonna play play play play play", $scope.playerss)
			var numPlayers = snap.numChildren();
			// when the first player joins the game generate a black card
			if (numPlayers === 1 && !$scope.currentState){
				CardsService.dealBlackCard();
				console.log("CARD GENERATION METHOD 1 COMPLETE!")
			}
			//when there are 3 players move the game into the first game state
			if (numPlayers === 3 && !$scope.currentState) {
				gameStateRef.set(1);
				console.log("STARTING GAME", $scope.playerss)
			}
		});

		// if someone leaves alert everyone
		playersRef.on("child_removed", function(snap) {
			var assHole = snap.val();
			var numPlayers = $scope.playerss.length;
			// if the game is over, reset the game
			if (numPlayers < 3 ){
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: "some asshole quit !",
					showConfirmButton: true,
					confirmButtonText: "CANNOT CONTINUE' ",
				});
				GameService.gameInstance.set(null);
				$setTimeout(function() {$state.go('userPage')}, 1000);
			}
		});

		$scope.removePlayer = function(){
			GameService.removePlayer();
			$state.go("userPage");
		}

		/* _____________
		|              |
		| GAME STATE   |
		|______________| */


		//connect with firebase game states
		gameStateRef.on('value', function(snap) {
			var thisState = snap.val();
			$rootScope.voted = false;
			console.log("CONSOLE ME HEROKU... PLEASE", $rootScope.voted)
			console.log("GAME REF JUST CHANGED TO: ", thisState)
			// have one player initiate the dealing of the black card
			if (thisState === 1){
				var playas = $scope.playerss
				var player1 = playas[0];
				console.log("I MAY OR MAY NOT BE PLAYER ONE!!!!", player1)
				if (myId === player1.playerId){
					// scenarioCardRef.remove();
					console.log("I AM PLAYER ONE!!!!", player1)
					CardsService.dealBlackCard();
					console.log("CARD GENERATION METHOD 2 COMPLETE!")
					console.log($scope.blackCard, "NEW BLACK CARD WOW!")
				}
			}
			$scope.currentState = thisState;
			//gameState(thisState);
			if (thisState === 3){
				console.log("!!!! POSTVOTE !!!!")
				votesRef.remove();
				responseRef.remove();
				// scenarioCardRef.remove();
				//myRef.child('voted').remove();
				myRef.child('submittedResponse').remove();
				//myRef.child('tempHand').remove();
				GameService.drawOneCard();
				gameStateRef.set(1);
			}
			thisGame.child('temp').set('temp');
			thisGame.child('temp').remove();
		})


		/* _____________
		|              |
		| cards        |
		|______________| */

		// if your hand changes, update what the scope sees as your hand
		myRef.child('cards').on('value', function(snap){
			$scope.myHand = snap.val();
		});
		// if the black card changes update what you see as the black card
		scenarioCardRef.on("value", function(snap) {
			$scope.blackCard = snap.val();
		});

		/* _____________
		|              |
		| Responses:   |
		|______________| */

		// notify firebase that I submitted a response card
		$scope.addToResponseCards = function(cardClicked, index) {
			console.log("cardClicked", cardClicked)
			GameService.addToResponseCards(cardClicked, index);
		}

		//update the scope when I submit a response card
		myRef.child('submittedResponse').on('value', function(snap){
			$scope.haveSubmitted = snap.val();
		})

		responseRef.on("value", function(snap) {
			var allResponses = snap.val();
			var numResponses = snap.numChildren();
			$scope.responses = allResponses;
			var numPlayers = $scope.playerss.length
			// console.log("NUM PLAYAS", numPlayers)
			console.log("RESPONSE REF IS NOW",allResponses)
			if (allResponses != null){
				if(allResponses.hasOwnProperty(myId)){
					console.log("I SUBMITTED A RESPONSE!")
					myRef.update({
						submittedResponse: true
					})
				}
			}
			if (numResponses === numPlayers && numResponses > 0) {
				console.log(snap.val(), "INSIDE");
				gameStateRef.set(2);
			}
		});

		/* _____________
		|              |
		| Votes:   		 |
		|______________| */


		$scope.voteCard = function(card){
			// console.log("ROOTSCOPE voted", $rootScope.voted, "BANG ROOTSCOPE", !$rootScope.voted)
			if ($rootScope.voted === true || $scope.currentState != 2){
				console.log("YOU ALREADY VOTED")
				return;
			}
			console.log("IN VOTECARD", card)
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
				// console.log("I AM ROOT:", $rootScope.voted)
				GameService.voteCard(card);
			}
		}

		votesRef.on("value", function(snap) {
			if ($scope.currentState != 2){
				return;
			}

			var numPlayers = $scope.playerss.length
			console.log("NUM PLAYAS in voted", numPlayers)

			var votes = snap.val();
			var votesLength = snap.numChildren();
			console.log(votesLength, "VOTES OUTSIDE THE IF IN VOTES");
			if (votesLength == numPlayers) {
				//console.log("INSIDE VOTES")

				//create a dictionary of players who received votes
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

				//create an array of objects from the votesCast dictionary
				var victors = Object.keys(votesCast).map(function(key) {
					return [key, votesCast[key]];
				});
				console.log("WINNER ARRAY PHASE 1.0", victors);

				// Sort the victors array based on the points
				// putting lowest number at 0 position
				victors.sort(function(a, b) {
					return a[1] - b[1];
				});

				console.log("WINNER ARRAY PHASE 2.0", victors);
				var winner = [];
				var prev = 0;
				var person = {};
				//compare each of the victors in the sorted array
				victors.forEach(function(victor, index, all){
					var player = victor[0];
					var votesWon = victor[1];
					var person = {};
					person.player = player;
					person.points = votesCast[player];
					if (votesWon > prev){
						winner = [];
						winner.push(person);
						prev = votesWon;
						console.log("PERSON IN GREATER THAN" ,person, "PREV", prev)
					} else if (votesCast[player] == prev){
						winner.push(person);
						console.log("PERSON IN LESS THAN" ,person, "PREV", prev)
					}
				})

				$timeout( function(){
					console.log("*.*.*.* WINNER ARRAY PHASE 3*.*.*.*", winner);
					winner.forEach(function(player){
						var player = player.player;
						console.log(player, "GETS A POINT !!!!")
						GameService.addWinPoint(player);
					})
				},50)

			} // end votes === playerss length
		});


		/* ______________
		|              |
		| Winner!			 |
		|______________| */

		thisGame.child('winner').on('child_added', function(snap){
			var winner = snap.val();
			console.log("Announcing the winner", snap.val());
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
					$scope.removePlayer();
				} else {
					cardsRef.remove();
					thisGame.child("winner").remove();
					votesRef.remove();
					responseRef.remove();
					myRef.remove();
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
		}



	});
