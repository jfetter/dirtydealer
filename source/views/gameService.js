'use strict';
angular.module('socialMockup')


.service('GameService', function($http, $firebaseObject, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){


	this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	this.playersRef = this.gameInstance.child("players");
	var playersRef = this.playersRef
	this.messageRef = this.gameInstance.child("messages")
	var messageRef = this.messageRef
	this.playerss = $firebaseArray(playersRef);
	this.messages = $firebaseArray(messageRef);
	this.votingRef = this.gameInstance.child("voting")


	//remove players
	this.removePlayer = function(){
		var player = JSON.parse(localStorage.player);
		console.log("player to remove", player);
		playersRef.child(player).remove();
		console.log("players before remove", this.playerss)
		localStorage.removeItem("player");
		console.log("players after remove", this.playerss)
	}

	this.pickCards = function(){
		var myId = JSON.parse(localStorage.player)
		var myHand = CardsService.startingHand();
		var tempYourHand = [];

		//var myHand = ["test3", "test4", "test5", "test6"]
		this.playersRef.child(myId).set({
			cards: myHand
		});
		console.log("picking a card")
		return myHand;
	}

	this.addPlayer = function(){
		var thisPlayer = Date.now();
		var gamePoints = 0;
		var cards = ["testA", "testB"];
		//var cards = CardService.DealWhite();
		//deal cards function here to populate array
		localStorage.player = thisPlayer;
		//console.log("this player logged In", localStorage.player)
		playersRef.child(thisPlayer).set({
			playerId: thisPlayer,
			cards: cards,
			gamePoints: gamePoints
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

	this.addMessage = function(message) {
		console.log(message);
		var player = JSON.parse(localStorage.player);
		this.messages.$add({
			text: message,
			player: player,
			timestamp: Date.now()
		});
	}

	var tempYourHand = [];

	this.addToVotedCards = function(cardClicked, index) {
		var myId = JSON.parse(localStorage.player)
		this.playersRef.child(myId).on('value', function(snap){
			tempYourHand = snap.val()
			console.log("YO HAND!", tempYourHand)
		})
		var myId = JSON.parse(localStorage.player)
		tempYourHand.cards.splice(index, 1);
		this.playersRef.child(myId).set(tempYourHand)
		this.votingRef.child(myId).set({
			text: cardClicked
		});
		return tempYourHand.cards;
// <<<<<<< HEAD
// =======
		// return this.votingRef;
// >>>>>>> 0a9646ddae5fb9a50d4eb062ccb40ac140ae2840
	}

});
