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
	this.gameList = rootRef.child('games');
	var gameList = this.gameList;
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
		$rootScope.gameInstance = gameList.child(gameId);
		var gameInstance = gameList.child(gameId)
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
 	$rootScope.gameInstance = gameList.child(gameName);
	$rootScope.playersRef = $rootScope.gameInstance.child('players');
	$rootScope.cardsRef = $rootScope.gameInstance.child('cards');
	$rootScope.messageRef = $rootScope.gameInstance.child('messages');

	gameList.child(gameName).update({
	 		id: gameName,
	 		host: myId,
	 		gameSize: gameSize,
	 		cards: CardsService.startDeck()
 		})
	addPlayer(gameName);
 	localStorage.setItem("myGame", gameName);
 	$state.go('game');
 }

 // $rootScope.$watch('gameInstance', function(newVal){
 // 		$rootScope.gameInstance = newVal;
 // 		console.log("newVal", newVal)
 // })

$rootScope.joinGame = function(gameId){
	$rootScope.gameId = gameId;
 	$rootScope.gameInstance = gameList.child(gameId);
	$rootScope.playersRef = $rootScope.gameInstance.child('players');
	$rootScope.cardsRef = $rootScope.gameInstance.child('cards');

 	console.log("GAME SIZE FUNCTION", gameId);
 	$rootScope.gameId = gameId;
 	this.gameInstance = rootRef.child(gameId);
 	addPlayer(gameId);
 	localStorage.setItem("myGame", gameId);
 	$state.go('game')
 }

if (localStorage.myGame){
	var myGame = localStorage.myGame || null;
	console.log("MY GAME JUST BEFORE GAME INSTANCE", myGame)
	console.log("MY ROOTSCOPE GAME JUST BEFORE GAME INSTANCE", $rootScope.gameId)

	this.gameInstance = gameList.child(myGame);
	var gameInstance = this.gameInstance;
	this.playersRef = gameInstance.child('players'); 
	var playersRef = $rootScope.thisPlayersRef
	//needed for logout after game ended
	$rootScope.playersRef = gameInstance.child(myGame)
	//this.playerss = $firebaseArray(playersRef);
	//this.responseRef = gameInstance.child("response");
	//var responseRef = this.responseRef;
	//this.voteRef = gameInstance.child("votes");

	this.gamestateRef = gameInstance.child("gamestate");
	var gamestateRef = this.gamestateRef;
}

gameList.on('value', function(snap){
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
		//if (gameList.waiting.players[myId]){
			// waitingPlayers.child(myId).remove();
			// this.gameInstance = gameList.child(myGame);
			// var gameInstance = this.gameInstance
			// this.playersRef = gameInstance.child('players')
			// this.addPlayer(myId);
		//}
	})





	//remove players
	this.removePlayer = function(){
		if (!localStorage.myGame){
			return;
		}
		var myInfo = identifyPlayer()
		var myId = myInfo._id
		allPlayers.child(myId).remove();
		$rootScope.playersRef.child(myId).remove();
		localStorage.removeItem('myGame');
		console.log("PLAYER QUIT", myId)
	}

	this.pickCards = function(){
		console.log(myId, "IS IN THE HIZOUSE");
		var myHand = CardsService.startingHand();
		$rootScope.playersRef.child(myId).update({
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



});
