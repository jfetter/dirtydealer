'use strict';

angular.module('cardsAgainstHumanity')

.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){

	this.gameInstance = new Firebase("https://dirtydealer.firebaseio.com/cards");
	this.whiteCardRef = this.gameInstance.child("whiteCards")
	this.blackCardRef = this.gameInstance.child("blackCards")
	this.tempWhiteRef = this.gameInstance.child("tempWhite")

	//******DEALING BOTH DECKS:
	this.startDeck = function(){
		console.log("IN START DECK")
		this.gameInstance.child('whiteCards').set(whiteCards);
		this.gameInstance.child('blackCards').set(blackCards);
	}

	var tempBlackCard = [];
	this.blackCardRef.on('value', function(snap) {
		tempBlackCard = snap.val();
		//console.log("Black", tempBlackCard)
	});

	this.dealBlackCard = function(){
		//force black card value change on firebase
		this.blackCardRef.update({dummyCard: 'dummyCard'});
		this.blackCardRef.child('dummyCard').remove();
		//this.gameInstance.child("scenarioCard").set(null);
		var rando = Math.floor(Math.random() * tempBlackCard.length );
		var takenCard = tempBlackCard[rando];
		tempBlackCard.splice(rando, 1);
		this.scenarioCard = this.gameInstance.child("scenarioCard").set(takenCard)
		this.gameInstance.child('blackCards').set(tempBlackCard);
		return takenCard;
	}



var tempWhiteCard;
var whiteCardLength; 
	this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val()
	});


	this.startingHand = function(){
		//force white hand value change in firebase
		this.whiteCardRef.update({test: "test"});
		this.whiteCardRef.child('test').remove();
		var fullHand = [];
		for(var i = 0; i<10; i++){
			var rando = Math.floor(Math.random() * tempWhiteCard.length );
			var takenCards = tempWhiteCard[rando];
			tempWhiteCard.splice(rando, 1);
			fullHand.push(takenCards);
			this.gameInstance.child('whiteCards').set(tempWhiteCard)
		}
		return fullHand;
	}

	this.draw = function(){
		this.whiteCardRef.update({test: "test"});
		this.whiteCardRef.child('test').remove();
		this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val();
		whiteCardLength = snap.numChildren();
		//console.log("Temp white card updated", tempWhiteCard)
		//console.log("There are ", tempWhiteCard.length, " Temporary white cardss");
	});


		// for(var i=0; i<n; i++){
		//console.log("TEMP WHITE CARD IN DRAW FUNCTIOM HAND", tempWhiteCard);
		var rando = Math.floor(Math.random() * whiteCardLength ) ;
		var takenCard = tempWhiteCard[rando];
		//console.log("TAKEN", takenCard);
		tempWhiteCard.splice(rando, 1);
		this.gameInstance.child('whiteCards').set(tempWhiteCard);
		// }
		return takenCard
	}

});
