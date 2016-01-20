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



$scope.dealBlackCard = function(user){
  $scope.blackCards = blackCards;
  var deal = Math.floor(Math.random() * ($scope.blackCards.length - 0)) + 0;
  console.log($scope.blackCards[deal])
}



//******DEALING WHITE CARDS:
var whiteCardRef = gameInstance.child("whiteCards")
$scope.whiteCards = $firebaseArray(whiteCardRef)

var exampleHandRef = gameInstance.child("exampleHand")
// $scope.exampleHand = $firebaseArray(exampleHandRef)

// $scope.startingHand = function(user){
//   for(var i = 0; i<10; i++){
//     var rando = Math.floor(Math.random() * (whiteCards.length - 0)) + 0;
//     $scope.whiteCards.$add(whiteCards[rando])
//     $scope.whiteCards.splice(rando, 1)
//   }
// }

$scope.startingHand = function(user){
	$scope.whiteCards.$remove();
  for(var i = 0; i<10; i++){
		$scope.exampleHand = $firebaseArray(exampleHandRef)

    var rando = Math.floor(Math.random() * ($scope.whiteCards.length - 0)) + 0;
		$scope.exampleHand.$remove(rando);
    $scope.exampleHand.$add(whiteCards[rando])
		whiteCards.splice(rando, 1);
		console.log("Cards left", whiteCards.length)
		$scope.whiteCards.$remove(rando);
  }
		$scope.whiteCards.$add(whiteCards);
}

});
