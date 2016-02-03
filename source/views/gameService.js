'use strict';
angular.module('cardsAgainstHumanity')


.service('GameService', function($http, $firebaseObject, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper, $state){

	var myId	= ''
	var cookies = $cookies.get('token');
	if(cookies){
		$rootScope.userInfo = (jwtHelper.decodeToken(cookies))
		myId = $rootScope.userInfo._id;
	}

var identifyPlayer = function(){
var cookies = $cookies.get('token');
var myInfo = jwtHelper.decodeToken(cookies)
return myInfo;
}

	this.rootRef = new Firebase("https://dirtydealer.firebaseio.com/");
	var rootRef = this.rootRef;
	this.gamesList = rootRef.child('games');
	var gamesList = this.gamesList;
	this.allPlayers = rootRef.child('allPlayers');
	var allPlayers = this.allPlayers;
		// this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");
	this.playersRef;

	var gamesArray = $rootScope.gamesArray || null;
	var myGame = $rootScope.gameId;



	function addPlayer(gameId){


		var myInfo = identifyPlayer();
		var myId = myInfo._id;
		var userName = myInfo.username;
		$rootScope.gameInstance = gamesList.child(gameId);
		var gameInstance = gamesList.child(gameId)
	console.log("made it to addedPlayer function now test the rest of code")
	allPlayers.child(myId).set({
		playerId: myId,
		username: userName,
		cards: CardsService.startingHand(),
		gameId: gameId,
		gamePoints: 0
	})

		$rootScope.playersRef.child(myId).set({
			playerId: myId,
			username: myInfo.username,
			cards: CardsService.startingHand(),
			gamePoints: 0
		});
	}



$rootScope.newGame = function(gameSize){
	var myInfo = identifyPlayer();
	var myId = myInfo._id;
 	console.log("GAME SIZE FUNCTION", gameSize);
 	console.log("WHATS UP MY ID IS", myId)
 	var gameName = myId + Date.now();
 	$rootScope.gameId = gameName;
 	localStorage.setItem("myGame", gameName);
 	$rootScope.gameInstance = gamesList.child(gameName);
	$rootScope.playersRef = $rootScope.gameInstance.child('players');
	$rootScope.cardsRef = $rootScope.gameInstance.child('cards');
	gamesList.child(gameName).update({
	 		id: gameName,
	 		host: myId,
	 		gameSize: gameSize,
	 		cards: CardsService.startDeck()
 		})
	addPlayer(gameName);
 	$state.go('game');
 }

 $rootScope.$watch('gameInstance', function(newVal){
 		$rootScope.gameInstance = newVal;
 		console.log("newVal", newVal)
 })

$rootScope.joinGame = function(gameId){
 	console.log("GAME SIZE FUNCTION", gameId);
 	$rootScope.gameId = gameId;
 	this.gameInstance = rootRef.child(gameId);
 	localStorage.setItem("myGame", gameId);
 //	addPlayer();
 	$state.go('game')
 }

if (localStorage.myGame){
	var myGame = localStorage.myGame || null;
	console.log("MY GAME JUST BEFORE GAME INSTANCE", myGame)
	console.log("MY ROOTSCOPE GAME JUST BEFORE GAME INSTANCE", $rootScope.gameId)

	this.gameInstance = $rootScope.gameInstance
	var gameInstance = $rootScope.gameInstance
	this.playersRef = $rootScope.playersRef; 
	var playersRef = this.playersRef
	//this.messageRef = gameInstance.child("messages");
	//var messageRef = this.messageRef
	//this.playerss = $firebaseArray(playersRef);
	//this.messages = $firebaseArray(messageRef);
	//this.responseRef = this.gameInstance.child("response");
	// var responseRef = this.responseRef
	// this.voteRef = this.gameInstance.child("votes");
	// var voteRef = this.voteRef
	// this.votes = $firebaseArray(voteRef);
	// this.gameStateRef = this.gameInstance.child("gameState");
	// var gameStateRef = this.gameStateRef;
	// this.gameStateRef = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/gamestate");
}

gamesList.on('value', function(snap){
		if (snap.val() === null){
			return;
		}
		var tempGamesArray = [];
	// update the available games on user page
		snap.forEach(function(game){
			tempGamesArray.push(game.val());
		})
		$rootScope.gamesArray = tempGamesArray;

		//console.log("games Array", $rootScope.gamesArray )
		// add to appropriate game 
		//if (gamesList.waiting.players[myId]){
			// waitingPlayers.child(myId).remove();
			// this.gameInstance = gamesList.child(myGame);
			// var gameInstance = this.gameInstance
			// this.playersRef = gameInstance.child('players')
			// this.addPlayer(myId);
		//}
	})





	//remove players
	this.removePlayer = function(){
		if (localStorage.myGame){
			localStorage.removeItem('myGame')
		}
		var myInfo = identifyPlayer()
		var myId = myInfo._id
		//allPlayers.child(myId).remove();
		//playersRef.child(myId).remove();
		console.log("PLAYER QUIT", myId)
	}

	this.pickCards = function(){
		console.log(myId, "IS IN THE HIZOUSE");
		var myHand = CardsService.startingHand();
		this.playersRef.child(myId).update({
			cards: myHand
		});
		return myHand;
	}

	// this.drawCard = function(){
	// 	var myInfo = this.identifyPlayer()
	// 	var myId = myInfo._id
	// 	var newCard = CardsService.draw();
	// 	this.playersRef.child(myId).update({
	// 		cards: newCard
	// 	});
	// }



	/* ______________
	|              |
	| cards        |
	|______________| */

	//submit response card (game state 1)
	this.addToResponseCards = function(cardClicked, index) {
		var tempHand;
		console.log(cardClicked, "BEGINNNING");
		this.playersRef.child(myId).on('value', function(snap) {
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
	this.drawOneCard = function() {
		var tempHand;
		var newCard = CardsService.draw();
		this.playersRef.child(myId).on('value', function(snap) {
			//	console.log(snap.val().cards, "IN SNAP.VAL");
			tempHand = (snap.val().cards);
			//	console.log("Temporary hand", tempHand);
		})
		playersRef.child(myId).update({tempHand: tempHand})
		tempHand.push(newCard);
		playersRef.child(myId).update({cards: tempHand})
		return tempHand
	}

	//vote for a card (game state 2)
	this.voteCard = function(card){
		//console.log("!!!!!You're trying to vote for!!!!", card.text, card.player)
		var player = card.player;
		this.votes.$add(player);
	}

	//deal a new white card for the player (game state 3)
	this.updatePlayerAfterVote = function(){
		// find player in player array
		if (player.votes > highestVotes){
			//increment this players points key
		}
		// restockHand(n); where n = number of cards to replace in hand
		console.log("player should have new cards and new point total now")
	}

	/* ______________
	|              |
	| win points   |
	|______________| */

	// if you won the round add a point to your score (game state 2)
	this.addWinPoint = function(player){

		var myRef = playersRef.child(myId);

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
			if (myNewPoints >= 3){
				winnerName = winnerName + "!";
				console.log('we have a winner', player)
				updateMongoWins(player);
				this.gameInstance.child('winner').set({
					userId: player,
					winnerName: winnerName
				});
			}
			playersRef.child(player).update({gamePoints: myNewPoints})
			console.log(player, 'got a win point');
			// this code is not tested and not finished !!!!!
			gameStateRef.set(3)
		} //end if me
		return;
	} // end add win point

	/* ______________
	|              |
	| update MONGO |
	|______________| */

	function updateMongoWins(winner){
		console.log("OFF TO MOGO DB TO LOOK FOR", winner)
		//var winner = winner.userId;
		$http.post("user/dirtyWin", {userId: winner})
		.then(function (res){
		console.log(res);
		}, function(err){
		console.error(err);
		})
	}


	/* ______________
	|              |
	| messages     |
	|______________| */

	this.addMessage = function(message, player) {
		if(!message) return;

		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies);
		console.log(message, "MESSAGE I TYPE WHOO");

		this.messages.$add({
			text: message,
			username: token.username,
			timestamp: Date.now()
		});
	}

});
