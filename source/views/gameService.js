'use strict';
angular.module('socialMockup')


.service('GameService', function($http, $firebaseObject, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){


	this.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");

	this.playersRef = this.gameInstance.child("players");
	var playersRef = this.playersRef
	this.messageRef = this.gameInstance.child("messages")
	var messageRef = this.messageRef
	this.playerss = $firebaseArray(playersRef);
	this.messages = $firebaseArray(messageRef);

			//remove players
	this.removePlayer = function(){
    var player = JSON.parse(localStorage.player);
		console.log("player to remove", player);
		playersRef.child(player).remove();
		console.log("players before remove", this.playerss)
		localStorage.removeItem("player");
		console.log("players after remove", this.playerss)

}

this.addPlayer = function(){
		var thisPlayer = Date.now();
    var gamePoints = 0;
    var cards = ["test1", "test2"];
    //var cards = CardService.DealWhite();
    //deal cards function here to populate array
		localStorage.player = thisPlayer;
		//console.log("this player logged In", localStorage.player)
		playersRef.child(thisPlayer).set({
      playerId: thisPlayer,
      cards: cards,
      gamePoints: gamePoints
    });
	}

  this.updatePlayerAfterVote = function(){
    // find player in player array
    if (player.votes > highestVotes){
    //increment this players points key
    }
    // restockHand(n); where n = number of cards to replace in hand
    console.log("player should have new cards and new point total now")
  }

	this.addMessage = function(message) {
		console.log(message);
    var player = JSON.parse(localStorage.player);
		this.messages.$add({
			 text: message,
			 player: player,
			 timestamp: Date.now()
		});
	}

});
