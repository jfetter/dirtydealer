'use strict';
angular.module('socialMockup')

.service('GameService', function($http, $firebaseObject, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){

	this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	this.playersRef = this.gameInstance.child("players");
	var playersRef = this.playersRef
	this.messageRef = this.gameInstance.child("messages")
	var messageRef = this.messageRef;
	this.playerss = $firebaseArray(playersRef);
	this.messages = $firebaseArray(messageRef);

			//remove players
	this.removePlayer = function(){
    var player = JSON.parse(localStorage.player);
		console.log("player to remove", player);
		playersRef.child("player").remove();
		console.log("players before remove", this.playerss)
		localStorage.removeItem("player");
		console.log("players after remove", this.playerss)
}

this.addPlayer = function(){
		var thisPlayer = Date.now();
		localStorage.player = thisPlayer;
		console.log("this player logged In", localStorage.player)
		playersRef.child('player').set({player: thisPlayer});
	}

	this.addMessage = function(message) {
		console.log(message);
		this.messages.$add({
			text: message
			// user: $id
			// timestamp: Date.now();
		});
	}

});
