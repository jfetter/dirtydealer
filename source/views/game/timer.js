'use strict';
angular.module('cardsAgainstHumanity')


.service('TimerService', function($http, $firebaseObject, $interval, $timeout, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){

	this.timerRef = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/timer");

	this.countDown = function(counter){
		//console.log("REMAINING SECONDS", counter)
		this.timerRef.set(counter);
	};
})
