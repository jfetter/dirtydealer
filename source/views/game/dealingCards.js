'use strict';

angular.module('socialMockup')


.controller('dealingCardsCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){


// //******DEALING BOTH DECKS:
// $scope.startDeck = function(user){
//   $scope.whiteCards.$add(whiteCards)
//   $scope.blackCards.$add(blackCards)
// }
//
//
// //******DEALING BLACK CARDS:
// var blackCardRef = gameInstance.child("blackCards")
// $scope.blackCards = $firebaseArray(blackCardRef)
//
//
// $scope.dealBlackCard = function(user){
//   $scope.blackCards = blackCards;
//   var deal = Math.floor(Math.random() * ($scope.blackCards.length - 0)) + 0;
//   console.log($scope.blackCards[deal])
// }
//
//
//
// //******DEALING WHITE CARDS:
// var whiteCardRef = gameInstance.child("whiteCards")
// $scope.whiteCards = $firebaseArray(whiteCardRef)
//
// $scope.startingHand = function(user){
//   for(var i = 0; i<10; i++){
//     var rando = Math.floor(Math.random() * (whiteCards.length - 0)) + 0;
//     $scope.whiteCards.$add(whiteCards[rando])
//     $scope.whiteCards.splice(rando, 1)
//   }
// }

});
