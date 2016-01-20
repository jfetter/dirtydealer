'use strict';

angular.module('socialMockup')


.controller('dealingCardsCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){

	var gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	//******DEALING BOTH DECKS:
	$scope.startDeck = function(user){
		$scope.whiteCards.$add(whiteCards)
		$scope.blackCards.$add(blackCards)
	}


	//******DEALING BLACK CARDS:
	var blackCardRef = gameInstance.child("blackCards")
	$scope.blackCards = $firebaseArray(blackCardRef)

	var scenarioCardRef = gameInstance.child("scenarioCardRef")
	$scope.scenarioCardRef = $firebaseArray(scenarioCardRef)


	$scope.dealBlackCard = function(user){
		$scope.blackCards.$remove(0);
		var rando = Math.floor((Math.random() * blackCards.length ) + 0);
		var takenCards = blackCards[rando];
		$scope.scenarioCardRef.$add(takenCards)
		blackCards.splice(rando, 1);
		$scope.blackCards.$add(blackCards);
	}


	//******DEALING WHITE CARDS:
	var whiteCardRef = gameInstance.child("whiteCards")
	$scope.whiteCards = $firebaseArray(whiteCardRef)

	var exampleHandRef = gameInstance.child("exampleHand")
	$scope.exampleHand = $firebaseArray(exampleHandRef)



	$scope.startingBand = function(user){
		$scope.whiteCards.$remove(0);
		for(var i = 0; i<10; i++){
			var rando = Math.floor((Math.random() * whiteCards.length ) + 0);
			var takenCards = $scope.whiteCards[0][rando];
			console.log("Taken cards", takenCards)
		}
		$scope.whiteCards.$add(whiteCards);
	}

	$scope.howManyCards = function(){
		console.log("Firebase", $scope.whiteCards[0].length);
		console.log("Local", whiteCards.length);
	}
	$scope.takeASingleCard = function(){
		$scope.whiteCards.$remove($scope.whiteCards[3])
		console.log($scope.whiteCards.$remove)

	}
	$scope.startingHand = function(){
		whiteCards = $scope.whiteCards[0]
		console.log("New cards", whiteCards)
		for(var i = 0; i<10; i++){
			var rando = Math.floor((Math.random() * whiteCards.length ) + 0);
			// var takenCards = whiteCards[rando];
			var takenCards = $scope.whiteCards[0][rando];
			console.log("Rando", rando)
			console.log("Taken cards", takenCards)
			whiteCards.splice(rando, 1);
			$scope.exampleHand.$add(takenCards)
			console.log("Cards left", whiteCards.length)

			$scope.whiteCards.$remove(0);
			$scope.whiteCards.$save(whiteCards);
		}
			// $scope.whiteCards.$add(whiteCards);
	}



	$scope.drawOne = function(user){
		$scope.whiteCards.$remove(0);
		var rando = Math.floor((Math.random() * whiteCards.length ) + 0);
		var takenCards = whiteCards[rando];
		$scope.exampleHand.$add(takenCards)
		whiteCards.splice(rando, 1);
		$scope.whiteCards.$add(whiteCards);
	}


});
