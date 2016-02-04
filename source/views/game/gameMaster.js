
'use strict';
angular.module('cardsAgainstHumanity')


.controller('gameMasterCtrl', function(TimerService, $timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, CardsService, $http){

	/* ______________
	|              |
	|  User Auth:  |
	|______________| */
	var myGame = localStorage.myGame || null; 
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
		| Firebase:    |
		|______________| */

// track game number in localStorage. 
		// $rootScope.$watch('gameId', function(){
		// 	if (!localStorage.myGame){
		// 		//localStorage.setItem("myGame", myGame);
		// 	}
		// })

		$rootScope.$watch('gameInstance', function(newVal, oldVal){
			console.log("thisGame has these values", newVal);
		})

		// $rootScope.$watch('cardsRef', function(newVal, oldVal){
		// 	console.log("NEW VAL OF CARDSREF",  newVal, "root is", $rootScope.cardsRef)
		// })

		$rootScope.$watch('playersRef', function(newVal, oldVal){
			console.log("players watch says players are", newVal)

		})		

function dealBlackCard(){
		var player1 = $scope.player1;
		console.log("I MAY OR MAY NOT BE PLAYER ONE!!!!", player1)
		if (myId == player1 && !$rootScope.blackCard){
			console.log("I AM PLAYER ONE!!!!", player1)
			CardsService.dealBlackCard();
			console.log($rootScope.blackCard, "NEW BLACK CARD WOW!")
		}
	}
		$rootScope.$watch('gameStateRef', function(newVal, oldVal){
			if (newVal != oldVal) dealBlackCard();
		})

		var rootRef = GameService.rootRef;
	  var gameList = GameService.gameList;
		var allPlayers = GameService.allPlayers;

				// anytime something changes... check in with the scope
		rootRef.on('value', function(snap){
			console.log("time to rethink the refresh check in");
			$rootScope.gamesArray = snap.val().games;
		})


gameList.once('value', function(snap) { 
	console.log("MY GAME IN TOP OF GAME MASTER", myGame)
	if (!localStorage.myGame){
		return;
	}
	var myGameInfo; 
	snap.forEach(function(game){
		if (game.val().id === myGame)
		myGameInfo = game.val(); 
	})
	console.log("SNAP VAL", snap.val()[myGame]);
})


	//if(localStorage.myGame){
		myGame = localStorage.myGame;
		var thisGame = gameList.child(myGame);
		var playersRef = thisGame.child("players");
		$rootScope.playersRef = playersRef; 
		var myRef = playersRef.child(myId);
		var responseRef = thisGame.child("response");

		var cardsRef = thisGame.child('cards');
		$rootScope.cardsRef = cardsRef;
		var whiteCardRef = cardsRef.child('white');
		var whiteCardRef = cardsRef.child('black');
		var scenarioCardRef = cardsRef.child('scenarioCard');
		 
		var gamestateRef = thisGame.child("gamestate");
		var votesRef = thisGame.child("votes");
		var cardsRef = thisGame.child("cards");
		var winVotes = thisGame.child("votes");
		
		var messageRef = thisGame.child("messages")
		//$scope.playerss = GameService.playerss



		/* ______________
		|              |
		| Players:     |
		|______________|
		*/

		// each time timer ticks firebase will check on game
		thisGame.on('value', function(snap){
			var snappy = snap.val();
			if (snappy === null){
				return;
			}
			$rootScope.myGameSize = snappy.gameSize; 

			$scope.currentState = snappy.gamestate;

			if(snappy.player1){
				$scope.player1 = snappy.player1.playerId;
				console.log("PLAYER 1", $scope.player1)
			};
			$scope.playerss = $firebaseArray(playersRef)
			// if ($scope.playerss === null || $scope.playerss === undefined ){
			// 	$scope.playerss = [];
			// } 			

			//make sure you can see	response cards
			if (snappy.response != null){
				$scope.responses = snappy.response
			}
			// make sure you can see your hand
			//$scope.myHand = snap.players[myId].cards;
			//console.log("MY HAND", $scope.myHand);
			//make sure you can see the black card
			// var cards;
			// snap.forEach(function(item){
			// 	if (item.cards){
			// 		cards = item.val();
			// 		console.log("CARDS???", item.val());
			// 	}
			// })
			// if (cards){
			// 	$rootScope.blackCard = cards.scenarioCard;
			// 	console.log("rootBlackCard in game watcher", $rootScope.blackCard)
			//}
		})


		//Any time someone leaves or joins the game check in with F.B.
		playersRef.on("value", function(snap) {

			var players = [];
			snap.forEach (function(player){
				players.push(player.val());
			});
			if (!snap.val().player1){
				thisGame.child("player1").set(players[0]);
			}
			$scope.playerss = players;
			var numPlayers = snap.numChildren();
			//when there are 3 players move the game into the first game state
			if (numPlayers === $rootScope.myGameSize && !$scope.currentState) {
				gamestateRef.set(1);
				console.log("STARTING GAME", $scope.playerss);
			}
		});

			if ($scope.playerss === null || $scope.playerss === undefined ){
			$scope.playerss = [];
		} else{
			var players = [];
			for (var player in $scope.playerss){
				players.push(player);
			}
			$scope.playerss = players;
		}

		// if someone leaves alert everyone
		playersRef.on("child_removed", function(snap) {
			var assHole = snap.val();
			var numPlayers = $scope.playerss.length;
			thisGame.child('player1').remove();
			console.log("CURRENT NUM PLAYERS", numPlayers)
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
				$timeout(function() {$state.go('userPage')}, 1000);
			}
		});


		/* ______________
		|              |
		| Winner!			 |
		|______________| */

		thisGame.child('winner').on('child_added', function(snap){
			var winner = snap.val();
			// var winningBlackCard = thisGame.child('scenarioCard').text();
			// var winningWhiteCard = thisGame.child()

			//console.log("Announcing the winner", snap.val().winnerName);
			console.log("Announcing the winner", snap.val());

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
						GameService.removePlayer();
				} else {
					cardsRef.remove();
					thisGame.child("winner").remove();
					votesRef.remove();
					responseRef.remove();
					myRef.remove();
					$timeout(function() {
					location.reload(true);
					}, 2000)
				};
			});
			return;
		});

		/* _____________
		|              |
		| GAME STATE   |
		|______________| */

		function drawOneCard() {
		var tempHand;
		var newCard = CardsService.draw();
		myRef.on('value', function(snap) {
			//	console.log(snap.val().cards, "IN SNAP.VAL");
			tempHand = (snap.val().cards);
			//	console.log("Temporary hand", tempHand);
		})
		myRef.update({tempHand: tempHand})
		tempHand.push(newCard);
		myRef.update({cards: tempHand})
		return tempHand
	}


		//connect with firebase game states
		gamestateRef.on('value', function(snap){
			var thisState = snap.val();
			$rootScope.voted = false;
			console.log("GAME REF JUST CHANGED TO: ", thisState)
			// have one player initiate the dealing of the black card
			if (thisState === 1){
				dealBlackCard();
			}
			$scope.currentState = thisState;
			//gamestate(thisState);
			if (thisState === 3){
				console.log("!!!! POSTVOTE !!!!")
				votesRef.remove();
				responseRef.remove();
				scenarioCardRef.remove();
				$rootScope.blackCard = null;
				//myRef.child('voted').remove();
				myRef.child('submittedResponse').remove();
				//myRef.child('tempHand').remove();
				drawOneCard();
				gamestateRef.set(1);
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
		cardsRef.on("value", function(snap) {
			$rootScope.blackCard = snap.val().scenarioCard;
			console.log("BLACK CARD IS", $rootScope.blackCard)
		});

		//update the scope when I submit a response card
		myRef.child('submittedResponse').on('value', function(snap){
			$scope.haveSubmitted = snap.val();
		})


		/* _____________
		|              |
		| Responses:   |
		|______________| */

		responseRef.on("value", function(snap) {
			var allResponses = snap.val();
			var numResponses = snap.numChildren();
			$scope.responses = allResponses;
			var numPlayers = $scope.playerss.length
			console.log("NUM PLAYAS", numPlayers)
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
				gamestateRef.set(2);
			}
		});



		/* _____________
		|              |
		| Votes:   		 |
		|______________| */

		votesRef.on("value", function(snap) {
			if ($scope.currentState != 2){
				return;
			}

			var numPlayers = $scope.playerss.length
			console.log("NUM PLAYAS in voted", numPlayers)

			var votes = snap.val();
			var votesLength = snap.numChildren();
			console.log(votesLength, "VOTES OUTSIDE THE IF IN VOTES");
			console.log("How many votes", votesLength)
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
						addWinPoint(player);
					})
				},50)

			} // end votes === playerss length
		});
 //}
		/* ______________
		|              |
		|Utility Functs|
		|______________| */


		$scope.removePlayer = function(){
			GameService.removePlayer();
			localStorage.removeItem('myGame')
			$state.go("userPage");
		}

	/* ______________
	|              |
	| cards        |
	|______________| */

	//submit response card (game state 1)
	$scope.addToResponseCards = function(cardClicked, index) {
		var tempHand;
		console.log(cardClicked, "BEGINNNING");
		playersRef.child(myId).on('value', function(snap) {
			//console.log(snap.val().cards, "IN SNAP.VAL");
			tempHand = (snap.val().cards);
			//console.log("Temporary hand", tempHand);
		})
		if(tempHand.length < 10){
			return tempHand;
		}
		playersRef.child(myId).update({tempHand: tempHand})
		tempHand.splice(index, 1);
		playersRef.child(myId).update({cards: tempHand})
		responseRef.child(myId).set({text: cardClicked, player: myId})
		return tempHand
	}

		// notify firebase that I submitted a response card
		// $scope.addToResponseCards = function(cardClicked, index){
		// 	console.log("cardClicked", cardClicked)
		// 	GameService.addToResponseCards(cardClicked, index);
		// }

	 function updateVoteRef(card){
		var votes = $firebaseArray(votesRef);
		var player = card.player;
		votes.$add(player);
	}

		$scope.voteCard = function(card){
			console.log("ROOTSCOPE voted", $rootScope.voted, "BANG ROOTSCOPE", !$rootScope.voted)
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
				console.log("I AM ROOT:", $rootScope.voted)
				updateVoteRef(card);
			}
		}


	/* ______________
	|              |
	| win points   |
	|______________| */

	// if you won the round add a point to your score (game state 2)
	function addWinPoint(player){
		console.log("round winner is", player)

		//only add points once per player
		if (player === myId){
			var winnerName;

			var myPoints;
			myRef.on('value', function(snap) {
				myPoints = snap.val().gamePoints;
				winnerName = snap.val().username;
			})

			var myNewPoints = myPoints + 1;

			//FORCING FIREBASE TO TAKE SNAPSHOT OF PLAYER
			myRef.update({temp: "temp"});
			myRef.child('temp').remove();

			myRef.child('gamePoints').set(myNewPoints)
			if (myNewPoints >= 2){
				winnerName = winnerName + "!";
				console.log('we have a winner', player)
				GameService.updateMongoWins(player);
				thisGame.child('winner').set({
					userId: player,
					winnerName: winnerName
				});
			}
			$rootScope.playersRef.child(player).update({gamePoints: myNewPoints})
			console.log(player, 'got a win point');
			// this code is not tested and not finished !!!!!
			gamestateRef.set(3)
		} //end if me
		return;
	} // end add win point


	$scope.addMessage = function(message) {
		var messages = $firebaseArray('messageRef');
		$scope.messages = messages;
		if(!message) return;
		var myName = $scope.userInfo.username;
		console.log(message, "MESSAGE I TYPE WHOO");

		messages.$add({
			text: message,
			username: myName,
			timestamp: Date.now()
		});
	}


		// $scope.addMessage = function(message) {
		// 	addMessage(message);
		// }

	});
