'use strict';
angular.module('cardsAgainstHumanity')


.service('GameService', function($http, $firebaseObject, CardsService, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){

	var cookies = $cookies.get('token');


	this.gameInstance = new Firebase("https://rachdirtydeals.firebaseio.com/cah");

	this.playersRef = this.gameInstance.child("players");
	var playersRef = this.playersRef
	this.messageRef = this.gameInstance.child("messages");
	var messageRef = this.messageRef
	this.playerss = $firebaseArray(playersRef);
	this.messages = $firebaseArray(messageRef);
	this.responseRef = this.gameInstance.child("response");
	var responseRef = this.responseRef
	this.voteRef = this.gameInstance.child("votes");
	var voteRef = this.voteRef
	this.votes = $firebaseArray(voteRef);

	///Add game state to firebase
	this.gameStateRef = new Firebase("https://rachdirtydeals.firebaseio.com/cah/gamestate");
	var gameStateRef = this.gameStateRef;

	this.advanceGameState = function(){
		var next = "sad clown";
		gameStateRef.once('value', function(snap){
			next = snap.val() + 1;
			if ( next > 3){
				next = 1;
			}
			gameStateRef.set(next);
		})

	}



	//remove players
	this.removePlayer = function(){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id

		playersRef.child(myId).remove();
		console.log("PLAYER QUIT", myId)
	}

	this.identifyPlayer = function(){
		var cookies = $cookies.get('token');
		var myInfo = jwtHelper.decodeToken(cookies)
		return myInfo;
	}

	this.pickCards = function(){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		console.log(myId, "IS IN THE HIZOUSE");
		var myHand = CardsService.startingHand();
		this.playersRef.child(myId).update({
			cards: myHand
		});
		//return myHand;
	}

	// this.drawCard = function(){
	// 	var myInfo = this.identifyPlayer()
	// 	var myId = myInfo._id
	// 	var newCard = CardsService.draw();
	// 	this.playersRef.child(myId).update({
	// 		cards: newCard
	// 	});
	// }

	this.addPlayer = function(){
		//initialize test 'children'
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id;
		var cards = ["testA", "testB"];

		//set player data in firebase
		playersRef.child(myId).set({
			playerId: myInfo._id,
			username: myInfo.username,
			cards: cards,
			gamePoints: 0
		});
	}



	/* ______________
	|              |
	| cards        |
	|______________| */

	//submit response card (game state 1)
	this.addToResponseCards = function(cardClicked, index) {
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		var tempHand;
		console.log(cardClicked, "BEGINNNING");
		this.playersRef.child(myId).on('value', function(snap) {
			//console.log(snap.val().cards, "IN SNAP.VAL");
			tempHand = (snap.val().cards);
			//console.log("Temporary hand", tempHand);
		})
		if(tempHand.length < 10){
			return tempHand
		}
		playersRef.child(myId).update({tempHand: tempHand})
		tempHand.splice(index, 1);
		playersRef.child(myId).update({cards: tempHand})
		responseRef.child(myId).set({text: cardClicked, player: myId})
		return tempHand
	}
	this.drawOneCard = function() {
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		var tempHand;
		var newCard = CardsService.draw();
		this.playersRef.child(myId).on('value', function(snap) {
			//	console.log(snap.val().cards, "IN SNAP.VAL");
			tempHand = (snap.val().cards);
			//	console.log("Temporary hand", tempHand);
		})
		playersRef.child(myId).update({tempHand: tempHand})
		tempHand.push(newCard);
		playersRef.child(myId).update({cards: tempHand})
		return tempHand
	}

	//vote for a card (game state 2)
	this.voteCard = function(card){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		//console.log("!!!!!You're trying to vote for!!!!", card.text, card.player)
		var player = card.player;
		this.votes.$add(player);
	}

	//deal a new white card for the player (game state 3)
	this.updatePlayerAfterVote = function(){
		// find player in player array
		if (player.votes > highestVotes){
			//increment this players points key
		}
		// restockHand(n); where n = number of cards to replace in hand
		console.log("player should have new cards and new point total now")
	}

	/* ______________
	|              |
	| win points   |
	|______________| */

	// if you won the round add a point to your score (game state 2)
	this.addWinPoint = function(player){
		var myInfo = this.identifyPlayer()
		var myId = myInfo._id
		var myRef = playersRef.child(myId);


		//only add points once per player
		if (player === myId){
			var winnerName;
			// var winningWhiteCard;

			var myPoints;
			myRef.on('value', function(snap) {
				myPoints = snap.val().gamePoints;
				winnerName = snap.val().username;
			})

			var myNewPoints = myPoints + 1;

			//FORCING FIREBASE TO TAKE SNAPSHOT OF PLAYER
			myRef.update({temp: "temp"});
			myRef.child('temp').remove();

			myRef.child('gamePoints').set(myNewPoints)
			if (myNewPoints >= 1){
				winnerName = winnerName + "!";
				console.log('we have a winner')
				this.gameInstance.child('winner').set({
					userId: player,
					winnerName: winnerName
					// winningWhiteCard = snap.val().repsonseRef.child(myId)
				});
				updateMongoWins(player, myId);
			}
			playersRef.child(player).update({gamePoints: myNewPoints})
			console.log(player, 'got a win point');
			// this code is not tested and not finished !!!!!
			gameStateRef.set(3)
		}

		return;
	}

	/* ______________
	|              |
	| update MONGO |
	|______________| */

	function updateMongoWins(winner, me){
		console.log("set up route etc to add win point to mongo")
		//var winner = snap.val().userId;
		//if (winner === myInfo._id){
		//$http.put("/dirtyWin", {id: winner})
		//.then(function (res){
		// console.log(res);
		//}, function(err){
		//console.log(err)
		//})
		//}
	}



	/* ______________
	|              |
	| messages     |
	|______________| */

	this.addMessage = function(message, player) {
		if(!message) return;

		var cookies = $cookies.get('token');
		var token = jwtHelper.decodeToken(cookies);
		console.log(message, "MESSAGE I TYPE WHOO");

		var myId = localStorage.player;
		var thisPlayer = token._id;

		this.messages.$add({
			text: message,
			username: token.username,
			timestamp: Date.now()
		});
	}

});
