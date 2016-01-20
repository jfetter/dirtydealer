'use strict';

angular.module('socialMockup')


.service('CardsService', function($timeout, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, $http){

	// this.playersRef = this.gameInstance.child("players");
	// var playersRef = this.playersRef
	// this.messageRef = this.gameInstance.child("messages")
	// var messageRef = this.messageRef

	var gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");
	this.whiteCardRef = gameInstance.child("whiteCards")
	var whiteCardRef = this.whiteCardRef;
	this.blackCardRef = gameInstance.child("blackCards")
	var blackCardRef = this.blackCardRef;

	//******DEALING BOTH DECKS:
	this.startDeck = function(){
		console.log("IN START DECK")
		whiteCardRef.$add({array: whiteCards})
		blackCardRef.$add(blackCards)
	}


	//******DEALING BLACK CARDS:
	//$scope.blackCards = $firebaseArray(blackCardRef)

	// var scenarioCardRef = gameInstance.child("scenarioCardRef")
	// $scope.scenarioCard = $firebaseArray(scenarioCardRef)

	// $scope.listPlayers = function(){
	// 	console.log("Players?", playersRef)
	// }

	// $scope.dealBlackCard = function(){
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



	//******DEALING WHITE CARDS:
	//$scope.whiteCards = $firebaseArray(whiteCardRef)

	// var exampleHandRef = gameInstance.child("exampleHand")
	// $scope.exampleHand = $firebaseArray(exampleHandRef)

	// $scope.whoAmI = function(){
		
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
