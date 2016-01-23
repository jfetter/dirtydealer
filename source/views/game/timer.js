'use strict';
angular.module('cardsAgainstHumanity')


.service('TimerService', function($http, $firebaseObject, $interval, $timeout, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){

	this.timerRef = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/timer");
	//var counter = 60;
	//this.mytimeout = null;


	this.countDown = function(counter){
		console.log("REMAINING SECONDS", counter)
		this.timerRef.set(counter);
	};




	// 	this.timerRef.on('value', function(snap){
	// 	console.log(snap)
	// 	var counter = snap --
	// 	this.timerRef.set(counter);
	// 	return snap;
	// })

})
