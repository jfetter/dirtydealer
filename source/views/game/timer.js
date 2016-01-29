'use strict';
angular.module('cardsAgainstHumanity')


.service('TimerService', function($http, $firebaseObject, $interval, $timeout, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){
	var myGame = $rootScope.myGame;

	this.timerRef = new Firebase(`https://rachdirtydeals.firebaseio.com/games/${myGame}/timer`);
	var timerRef = this.timerRef;
	this.counter = 61;
	var counter = this.counter;
	var mytimeout = null;

		var countDown = function(){
			console.log("IN COUNTDOWN FUnCTION", counter)
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
