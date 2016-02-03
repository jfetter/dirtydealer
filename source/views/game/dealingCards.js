'use strict';

angular.module('cardsAgainstHumanity')

.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){

	
	var rootRef = new Firebase("https://dirtydealer.firebaseio.com/");
	var gameList = rootRef.child('games');
	var myGame = localStorage.myGame;

	this.startDeck = function(){	
		var cards = {};
		cards.white = whiteCards
		cards.black = blackCards
		return cards;
	}

	this.dealBlackCard = function(){
		var blackCardRef = $rootScope.cardsRef.child('black');
		console.log("IN DRAW FUNCTION CARD REF", blackCardRef);
		var tempBlackCard;
		var blackCardLength;
		cardRef.on('value', function(snap) {
			tempBlackCard = snap.val().black;
			//var tempBlackCard2 = snap.val().black;
			console.log("temp black card",tempBlackCard);
		});
		//force black card value change on firebase
		cardRef.child("scenarioCard").remove();
		var rando = Math.floor(Math.random() * blackCardLength );
		var takenCard = tempBlackCard[rando];
		tempBlackCard.splice(rando, 1);
		console.log("SETTING TAKEN CARD", takenCard)
		cardRef.child("scenarioCard").set(takenCard);
		blackCardRef.set(tempBlackCard);
		return takenCard;
	}

	this.startingHand = function(){
		var tempWhiteCard;
	  var whiteCardLength; 
		var whiteCardRef = $rootScope.cardsRef.child('white');
		whiteCardRef.on('value', function(snap) {
			//console.log("the ellusive white snapper", snap.val())
			tempWhiteCard = snap.val();
			whiteCardLength = snap.numChildren();
	});
		//force white hand value change in firebase
		// whiteCardRef.update({test: "test"});
		 whiteCardRef.child('test').remove();
		var fullHand = [];
		for(var i = 0; i<10; i++){
			var rando = Math.floor(Math.random() * whiteCardLength );
			var takenCards = tempWhiteCard[rando];
			tempWhiteCard.splice(rando, 1);
			fullHand.push(takenCards);
			whiteCardRef.set(tempWhiteCard);
		}
		return fullHand;
	}

	this.draw = function(){
		var thisGameRef = gameList.child(myGame);
		var cardRef = thisGameRef.child('cards')
		console.log("IN DRAW FUNCTION CARD REF", cardRef);
		var whiteCardRef = cardRef.child('white');
		var tempWhiteCard;
		var whiteCardLength;
		console.log("WHITE CARD REF", whiteCardRef);
		whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val();
	});
		//force white hand value change in firebase
		whiteCardRef.update({test: "test"});
		whiteCardRef.child('test').remove();

		whiteCardRef.update({test: "test"});
		whiteCardRef.child('test').remove();
		whiteCardRef.on('value', function(snap) {
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
		cardRef.child('white').set(tempWhiteCard);
		// }
		return takenCard
	}

});
