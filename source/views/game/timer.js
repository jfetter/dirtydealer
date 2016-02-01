'use strict';
angular.module('cardsAgainstHumanity')


.service('TimerService', function($http, $firebaseObject, $interval, $timeout, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){
	var myGame = $rootScope.myGame;

	this.timerRef = new Firebase(`https://mycah.firebaseio.com/timer`);
	var timerRef = this.timerRef;
	this.counter = 250;
	var counter = this.counter;
	var mytimeout = null;

		var countDown = function(){
			//console.log("IN COUNTDOWN FUnCTION", counter)
			if(counter ===  0) {
			$rootScope.$broadcast('timer-stopped', 0);
			$timeout.cancel(mytimeout);
			return;
		}
		counter--;
		timerRef.set(counter);
		mytimeout = $timeout(countDown, 1000);
		}

	this.countDown = function(){
		countDown();
		};

})


	/* ______________
	|              |
	| Timer:       |
	|______________| */

	// //$scope.timerRef.on("value", function(snap){
	// 	//$scope.counter = snap.val();
	// //})

	// // Triggered, when the timer stops, can do something here, maybe show a visual alert.
	// $scope.$on('timer-stopped', function(event, remaining) {
	// 	//TIMER IF STATMENT DISCONNECTED
	// 	if(remaining === 0) {
	// 		if ($scope.haveSubmitted != true && $scope.currentState === 1){
	// 			//console.log("you should have submitted by now")
	// 			//console.log("My hand", $scope.myHand )
	// 			var rando = Math.floor((Math.random() * $scope.myHand.length ) + 0);
	// 			var spliced = $scope.myHand.splice(rando, 1)
	// 			spliced = spliced[0];
	// 			//console.log("spliced", spliced, "rando", rando);
	// 			GameService.addToResponseCards(spliced, rando)
	// 			myRef.child('cards').set($scope.myHand);
	// 			myRef.child('submittedResponse').set(true)
	// 		}

	// 			var otherPlayers = [];
	// 		if ($rootScope.voted != true && $scope.currentState === 2){
	// 			console.log($scope.playerss)
	// 			$scope.playerss.forEach(function(player){
	// 				if(player != myId){
	// 					otherPlayers.push(player)
	// 				}
	// 			})
	// 				var rando = Math.floor((Math.random() * otherPlayers.length ) + 0);
	// 				var spliced = otherPlayers.splice(rando, 1)
	// 				spliced = spliced[0].playerId;
	// 				winVotes.$add(spliced)
	// 				console.log("YOU VOTE FOR", spliced)
	// 		}
	// 		// $scope.counter = 60;
	// 		swal({
	// 			type: "error",
	// 			title: "Uh-Oh!",
	// 			text: "Next Phase is underway!",
	// 			showConfirmButton: true,
	// 			confirmButtonText: "GET GOIN' ",
	// 		});
	// 	}

	// });
