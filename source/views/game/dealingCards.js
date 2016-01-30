'use strict';

angular.module('cardsAgainstHumanity')

.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){


	// this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/cards");
	this.gameInstance = new Firebase("https://mycah.firebaseio.com/cards");
	this.whiteCardRef = this.gameInstance.child("whiteCards")
	this.blackCardRef = this.gameInstance.child("blackCards")
	this.scenarioCard = this.gameInstance.child("scenarioCard")

	// this.exampleHand = this.gameInstance.child("exampleHand")
	this.tempWhiteRef = this.gameInstance.child("tempWhite")

	//******DEALING BOTH DECKS:
	this.startDeck = function(){
		console.log("IN START DECK")
		this.gameInstance.child('whiteCards').set(whiteCards);
		this.gameInstance.child('blackCards').set(blackCards);
	}
	this.killCards = function(){
		this.blackCardRef.remove();
		this.scenarioCard.remove();
		this.whiteCardRef.remove();
	}
	var tempBlackCard = [];
	this.blackCardRef.on('value', function(snap) {
		tempBlackCard = snap.val();
		//console.log("Black", tempBlackCard)
	});

	this.dealBlackCard = function(){

		this.gameInstance.child("scenarioCard").set(null);
		var rando = Math.floor((Math.random() * tempBlackCard.length ) + 0);
		var takenCard = tempBlackCard[rando];
		console.log("TAKEN", takenCard);
		tempBlackCard.splice(rando, 1);
		this.scenarioCard = this.gameInstance.child("scenarioCard").set(takenCard)
		this.gameInstance.child('blackCards').set(tempBlackCard);
		return takenCard;
	}

var tempWhiteCard;
	this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val()
		console.log("Temp white card updated", tempWhiteCard)
		console.log("There are ", tempWhiteCard.length, " Temporary white cardss");
	});


	this.startingHand = function(){
		var fullHand = [];
		for(var i = 0; i<10; i++){
			console.log("TEMP WHITE CARD IN STARTING HAND", tempWhiteCard);
			var rando = Math.floor((Math.random() * tempWhiteCard.length ) + 0);
			var takenCards = tempWhiteCard[rando];
			tempWhiteCard.splice(rando, 1);
			fullHand.push(takenCards);
			this.gameInstance.child('whiteCards').set(tempWhiteCard)
			console.log("card exchange")
		}
		console.log('MY FULL HAND IS', fullHand)
		return fullHand;
	}

	this.draw = function(){
		this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val();

		console.log("Temp white card updated", tempWhiteCard)
		console.log("There are ", tempWhiteCard.length, " Temporary white cardss");
	});

		this.whiteCardRef.update({forcesnap: "forcesnap"});
		this.whiteCardRef.child('forcesnap').remove();

		// for(var i=0; i<n; i++){
		console.log("TEMP WHITE CARD IN DRAW FUNCTIOM HAND", tempWhiteCard);
		var rando = Math.floor((Math.random() * tempWhiteCard.length ) + 0);
		var takenCard = tempWhiteCard[rando];
		console.log("TAKEN", takenCard);
		tempWhiteCard.splice(rando, 1);
		this.gameInstance.child('whiteCards').set(tempWhiteCard);
		// }
		return takenCard
	}

});
