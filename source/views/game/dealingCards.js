'use strict';

angular.module('cardsAgainstHumanity')

.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){


	var tempBlackCard = [];
		//this.whiteCardRef = $rootScope.cardRef.child("whiteCards");
		//this.blackCardRef = $rootScope.cardRef.child("blackCards");
		//this.tempWhiteRef = $rootScope.cardRef.child("tempWhite");

	//$rootScope.cardRef; = new Firebase(`https://dirtydealer.firebaseio.com/games/${myGame}/cards`);
	
	var myGame = localStorage.myGame;
// 	$rootScope.$watch('gameId', function(){
// 	if (localStorage.myGame){
// 			//$rootScope.cardRef = new Firebase(`https://dirtydealer.firebaseio.com/games/${myGame}/cards`);
// 	}
// })

	this.startDeck = function(){	
		var cards = {};
		cards.white = whiteCards
		cards.black = blackCards
		return cards;
	}

	this.dealBlackCard = function(){
		blackCardRef = $rootScope.gameInstance.child('cards');
		var blackCardRef = $rootScope.cardsRef.child('black');
		$rootScope.blackCardRef = blackCardRef; 
		blackCardRef.on('value', function(snap) {
			tempBlackCard = snap.val();
			//console.log("Black", tempBlackCard)
			console.log("temp black card",tempBlackCard);
		});
		//force black card value change on firebase
		blackCardRef.update({dummyCard: 'dummyCard'});
		blackCardRef.child('dummyCard').remove();
		//this.cardRef.child("scenarioCard").set(null);
		var rando = Math.floor(Math.random() * tempBlackCard.length );
		var takenCard = tempBlackCard[rando];
		tempBlackCard.splice(rando, 1);
		this.scenarioCard = this.cardRef.child("scenarioCard").set(takenCard)
		this.cardRef.child('blackCards').set(tempBlackCard);
		return takenCard;
	}

	this.startingHand = function(){
		var tempWhiteCard;
	  var whiteCardLength; 
		var whiteCardRef = $rootScope.cardsRef.child('white');
		console.log("white Ref", whiteCardRef);
		whiteCardRef.on('value', function(snap) {
			console.log("the ellusive white snapper", snap.val())
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
		this.whiteCardRef.on('value', function(snap) {
		tempWhiteCard = snap.val()
	});
		//force white hand value change in firebase
		this.whiteCardRef.update({test: "test"});
		this.whiteCardRef.child('test').remove();

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
		this.cardRef.child('whiteCards').set(tempWhiteCard);
		// }
		return takenCard
	}

});
