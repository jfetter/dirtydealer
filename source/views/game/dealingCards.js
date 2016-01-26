'use strict';

angular.module('cardsAgainstHumanity')

.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){


	this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/cards");
	this.whiteCardRef = this.gameInstance.child("whiteCards")
	this.blackCardRef = this.gameInstance.child("blackCards")
	this.scenarioCard = this.gameInstance.child("scenarioCard")
	this.exampleHand = this.gameInstance.child("exampleHand")

	//******DEALING BOTH DECKS:
	this.startDeck = function(){

		console.log("IN START DECK")
		this.gameInstance.child('whiteCards').set({array: whiteCards});
		this.gameInstance.child('blackCards').set(blackCards);
	}

	var tempBlackCard = [];
	this.blackCardRef.on('value', function(snap) {
		tempBlackCard = snap.val();
		console.log("Black", tempBlackCard)
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

	var tempWhiteCard = [];
	this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val();
		console.log("BASE", tempWhiteCard)
	});


	this.startingHand = function(){
		var fullHand = [];
		for(var i = 0; i<10; i++){
			var rando = Math.floor((Math.random() * tempWhiteCard.array.length ) + 0);
			var takenCards = tempWhiteCard.array[rando];
			//console.log("Rando", rando)
		//	console.log("Taken cards", takenCards)
			tempWhiteCard.array.splice(rando, 1);
			//console.log("Cards left", tempWhiteCard.array.length)
			fullHand.push(takenCards);
			//this.gameInstance.child("exampleHand").push(takenCards)
		}
		this.gameInstance.child('whiteCards').set(tempWhiteCard)
		console.log('MY FULL HAND IS', fullHand)
		return fullHand;
	}

	this.draw = function(){
		// for(var i=0; i<n; i++){
			var rando = Math.floor((Math.random() * tempWhiteCard.array.length ) + 0);
			var takenCard = tempWhiteCard.array[rando];
			console.log("TAKEN", takenCard);
			tempWhiteCard.array.splice(rando, 1);
			this.gameInstance.child('whiteCards').set(tempWhiteCard);
		// }
		return takenCard
	}

});
