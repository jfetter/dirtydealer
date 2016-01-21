'use strict';

angular.module('socialMockup')

.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){


	this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/cards");
	this.whiteCardRef = this.gameInstance.child("whiteCards")
	//var whiteCardRef = this.whiteCardRef;
	this.blackCardRef = this.gameInstance.child("blackCards")
	//var blackCardRef = this.blackCardRef;
	this.scenarioCard = this.gameInstance.child("scenarioCard")



	// this.playersRef = gameInstance.child("players");
	// var playersRef = this.playersRef
	// this.messageRef = gameInstance.child("messages")
	// var messageRef = this.messageRef




	//******DEALING BOTH DECKS:
	this.startDeck = function(){
		console.log("IN START DECK")
		this.gameInstance.child('whiteCards').set({array: whiteCards})
		this.gameInstance.child('blackCards').set(blackCards)
	}

	//******DEALING BLACK CARDS:
	// $scope.blackCards = $firebaseArray(blackCardRef)
	//
	// var scenarioCardRef = gameInstance.child("scenarioCardRef")
	//
	// $scope.listPlayers = function(){
	// 	console.log("Players?", playersRef)
	// }
	//
		var basedCards = [];
		this.blackCardRef.on('value', function(snap) {
			basedCards = snap.val();
			console.log("BASE", basedCards)
		});
	this.dealBlackCard = function(){

		// $scope.scenarioCard.$remove(0);
		this.gameInstance.child("scenarioCard").set(null);
		// var basedCards = $scope.blackCards[0]


		var rando = Math.floor((Math.random() * basedCards.length ) + 0);
		var takenCards = basedCards[rando];
		// $scope.scenarioCard.$add(takenCards)
		console.log("TAKEN", takenCards);

		this.scenarioCard = this.gameInstance.child("scenarioCard").set(takenCards)
		basedCards.splice(rando, 1);
		// $scope.blackCards.$remove(0);
		this.gameInstance.child('blackCards').set(null);
		// $scope.blackCards.$add(basedCards);
		this.gameInstance.child('blackCards').set(basedCards)
		// console.log("Cards left", basedCards.length)
	}
	// this.dealBlackCard = function(){
	// 	$scope.scenarioCard.$remove(0);
	// 	var basedCards = $scope.blackCards[0]
	// 	console.log("BASE", basedCards)
	// 	var rando = Math.floor((Math.random() * basedCards.length ) + 0);
	// 	var takenCards = basedCards[rando];
	// 	$scope.scenarioCard.$add(takenCards)
	// 	basedCards.splice(rando, 1);
	// 	$scope.blackCards.$remove(0);
	// 	$scope.blackCards.$add(basedCards);
	// 	console.log("Cards left", basedCards.length)
	// }

	//
	//
	//
	// // ******DEALING WHITE CARDS:
	// $scope.whiteCards = $firebaseArray(whiteCardRef)
	//
	// var exampleHandRef = gameInstance.child("exampleHand")
	// $scope.exampleHand = $firebaseArray(exampleHandRef)
	//
	// $scope.whoAmI = function(){
	//
	// 	console.log($scope.user.username)
	// }
	// $scope.howManyCards = function(){
	// 	console.log("Firebase", $scope.whiteCards.text.length);
	// 	console.log("Local", whiteCards.length);
	// }
	// $scope.takeASingleCard = function(){
	// 	$scope.whiteCards.$remove($scope.whiteCards[3])
	// 	console.log($scope.whiteCards.$remove)
	// }
	//
	// $scope.killCards = function(){
	// 	$scope.whiteCards.$remove(0);
	// 	$scope.blackCards.$remove(0);
	// 	$scope.exampleHand.$remove(0);
	// }
	// $scope.startingHand = function(){
	// 	var basedCards = $scope.whiteCards[0]
	// 	console.log("New cards", basedCards)
	// 	for(var i = 0; i<10; i++){
	// 		var rando = Math.floor((Math.random() * basedCards.text.length ) + 0);
	// 		var takenCards = basedCards.text[rando];
	// 		console.log("Rando", rando)
	// 		console.log("Taken cards", takenCards)
	// 		basedCards.text.splice(rando, 1);
	// 		$scope.exampleHand.$add(takenCards)
	// 		console.log("Cards left", basedCards.text.length)
	// 		$scope.whiteCards.$remove(0);
	// 	}
	// 		$scope.whiteCards.$add(basedCards);
	// }
	// $scope.drawOne = function(user){
	// 	var basedCards = $scope.whiteCards[0]
	// 	var rando = Math.floor((Math.random() * basedCards.text.length ) + 0);
	// 	var takenCards = basedCards.text[rando];
	// 	basedCards.text.splice(rando, 1);
	// 	$scope.exampleHand.$add(takenCards)
	// 	$scope.whiteCards.$remove(0);
	// 	$scope.whiteCards.$add(basedCards);
	// 	console.log("Cards left", basedCards.text.length)
	// }
});
