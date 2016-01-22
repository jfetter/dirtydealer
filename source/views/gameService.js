'use strict';
angular.module('cardsAgainstHumanity')


.service('GameService', function($http, $firebaseObject, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){

	var cookies = $cookies.get('token');


	this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	this.playersRef = this.gameInstance.child("players");
	var playersRef = this.playersRef
	this.messageRef = this.gameInstance.child("messages");
	var messageRef = this.messageRef
	this.playerss = $firebaseArray(playersRef);
	this.messages = $firebaseArray(messageRef);
	this.responseRef = this.gameInstance.child("response");


	///Add game state to firebase
	this.gameStateRef = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/gamestate");
	var gameStateRef = this.gameStateRef;

	this.advanceGameState = function(){
		var next = "sad clown";
		gameStateRef.once('value', function(snap){
			next = snap.val() + 1;
			if ( next > 3){
				next = 1;
			}
			gameStateRef.set(next);
		})
	}



	//remove players
	this.removePlayer = function(){
		// var player = JSON.parse(localStorage.player);
		var player = localStorage.player;
		console.log("player to remove", player);
		playersRef.child(player).remove();
		console.log("players before remove", this.playerss)
		localStorage.removeItem("player");
		console.log("players after remove", this.playerss)
	}

	this.pickCards = function(){
		var cookies = $cookies.get('token');

		var token = jwtHelper.decodeToken(cookies)


		// var myId = JSON.parse(localStorage.player)
		var myId = localStorage.player
		var myHand = CardsService.startingHand();
		var tempYourHand = [];
		var gamePoints = 0;

		//var myHand = ["test3", "test4", "test5", "test6"]
		this.playersRef.child(myId).set({
			playerId: myId,
			username: token.username,
			cards: myHand,
			gamePoints: gamePoints,
			tempHand: []
		});
		console.log("picking a card")
		return myHand;
	}

	this.addPlayer = function(){
		var cookies = $cookies.get('token');

		var token = jwtHelper.decodeToken(cookies)

		// var thisPlayer = token.username;
		var thisPlayer = token._id;
		// var thisPlayer = Date.now();
		var gamePoints = 0;
		var cards = ["testA", "testB"];
		//var cards = CardService.DealWhite();
		//deal cards function here to populate array

		localStorage.player = thisPlayer;

		// token.username = thisPlayer;

		//console.log("this player logged In", localStorage.player)
		playersRef.child(thisPlayer).set({
			playerId: thisPlayer,
			username: token.username,
			cards: cards,
			gamePoints: gamePoints,
			tempHand: []
		});
	}

	this.updatePlayerAfterVote = function(){
		// find player in player array
		if (player.votes > highestVotes){
			//increment this players points key
		}
		// restockHand(n); where n = number of cards to replace in hand
		console.log("player should have new cards and new point total now")
	}

	this.addMessage = function(message, player) {
		if(!message) return;

		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies);
		console.log(message, "MESSAGE I TYPE WHOO");

		var myId = localStorage.player;
		var thisPlayer = token._id;

		this.messages.$add({
			text: message,
			username: token.username,
			timestamp: Date.now()
		});
	}


	this.addToResponseCards = function(cardClicked, index) {

		var myId = localStorage.player
		this.playersRef.child(myId).push({tempHand: cardClicked})

		console.log(cardClicked, "BEGINNNING");
		this.playersRef.child(myId).on('value', function(snap) {
			console.log(snap.val(), "IN SNAP.VAL");
		})
	}



	// var myId = JSON.parse(localStorage.player)

	// 	this.playersRef.child(myId).on('value', function(snap){
	// 		tempYourHand = snap.val()
	// 		subSpaceHand = snap.val()
	// 		console.log("YO HAND!", tempYourHand)
	// 	})
	// 	var myId = localStorage.player
	// 	tempYourHand.cards.splice(index, 1);
	// 	this.playersRef.child(myId).set(tempYourHand)
	// 	this.responseRef.child(myId).set({
	// 		text: cardClicked,
	// 	});
	//
	// 	if(sent){
	// 		var myId = localStorage.player;
	// 		// var tempYourHand = subSpaceHand;
	// 		// this.playersRef.child(myId).set(subSpaceHand)
	// 		this.responseRef.child(myId).remove({
	// 			text: cardClicked,
	// 		});
	// 		// tempYourHand.cards.splice(index, 1);
	// 		// return tempYourHand.cards;
	// 	}
	// 	return tempYourHand.cards;

	this.voteCard = function(card){
		var myId = localStorage.player
		console.log("You're trying to vote for:", card.text)
		var wop = card.text.replace('.','')
		this.responseRef.child(wop).push({
			points: myId
		});
	}
});
