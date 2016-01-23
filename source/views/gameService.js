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
	var responseRef = this.responseRef	
	this.voteRef = this.gameInstance.child("votes");
	var voteRef = this.voteRef
	this.votes = $firebaseArray(voteRef);


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

	this.identifyPlayer = function(){
		var cookies = $cookies.get('token');
		var myInfo = jwtHelper.decodeToken(cookies)
		return myInfo;
	}

	this.pickCards = function(){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		console.log(myId, "IS IN THE HIZOUSE");
		var myHand = CardsService.startingHand();
		this.playersRef.child(myId).update({
			cards: myHand
		});
		//return myHand;
	}

	this.addPlayer = function(){
		//initialize test 'children'
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id;
		var gamePoints = 0;
		var cards = ["testA", "testB"];

		//set player data in firebase
		playersRef.child(myId).set({
			playerId: myInfo._id,
			username: myInfo.username,
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
			var myInfo = this.identifyPlayer()
			var myId = myInfo._id
			var tempHand;
			console.log(cardClicked, "BEGINNNING");
			this.playersRef.child(myId).on('value', function(snap) {
				console.log(snap.val().cards, "IN SNAP.VAL");
				tempHand = (snap.val().cards);
				console.log("Temporary hand", tempHand);
			})
			if(tempHand.length < 10){
				return tempHand
			}
			playersRef.child(myId).update({tempHand: tempHand})
			tempHand.splice(index, 1);
			playersRef.child(myId).update({cards: tempHand})
			responseRef.child(myId).set({text: cardClicked, player: myId})
			return tempHand
	}


	this.voteCard = function(card){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		//console.log("!!!!!You're trying to vote for!!!!", card.text, card.player)
		var player = card.player;
		this.votes.$add(player);
	}


});
