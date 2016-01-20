'use strict';

angular.module('socialMockup')


.controller('gameCtrl', function($timeout, $scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper, $firebaseObject, $firebaseArray, GameService, $http){

	//*******USERAUTH
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		if (res.data === "authRequired"){$location.path('/login')}
		else{$scope.isLoggedIn = true;}
	})
	// $scope.$watch(function(){return $scope.searchTerm}, function(n,o){
	// 	$scope.updateSearch();
	// })

	$scope.isUser = function(user){
		if (user._id !== $scope.userInfo._id){
			return (false)
		} else {return true}
	}

	// $scope.getCards = function(user){
	// 	$scope.whiteCards = whiteCards;
	// 	for(var i = 0; i<10; i++){
	// 		var rando = Math.floor(Math.random() * ($scope.whiteCards.length - 0)) + 0;
	// 		console.log($scope.whiteCards[rando])
	// 		$scope.whiteCards.splice(rando, 1)
	// 	}
	// 	console.log($scope.whiteCards.length);
	// 	$scope.blackCards = blackCards;
	// 	var deal = Math.floor(Math.random() * ($scope.blackCards.length - 0)) + 0;
	// 	console.log($scope.blackCards[deal])
	// }

	//******FIREBASE
	//create a new game instance on the scope
	var gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");
	 // set up a reference for all of the players currently in this game instance
	//  var playersRef = $scope.gameInstance.child("players");
	//  var messageRef = $scope.gameInstance.child("messages")
	 var whiteCardRef = gameInstance.child("whiteCards")
	 var blackCardRef = gameInstance.child("blackCards")

	// create an array to store each player's info
	$scope.whiteCards = $firebaseArray(whiteCardRef)
	$scope.blackCards = $firebaseArray(blackCardRef)

  // $scope.addPlayer = function(){
  // 	// figure out how to pull user id info ... maybe store it on rootscope?
  // 	var thisPlayer = cookies;
  // 	console.log("this player logged In", thisPlayer)
  // 	$scope.playerss.$add({
  // 		id: thisPlayer
  // 	})
  // }
	 //
	//  playersRef.on("child_added", function() {
  //       $timeout(function() {
  //         $scope.numPlayers ++;
  //         console.log("PLAYER JOINED", $scope.numPlayers)
  //       });
  //     });
  //     playersRef.on("child_removed", function() {
  //       $timeout(function() {
  //         $scope.numPlayers -= 1;
  //         console.log("PLAYER QUIT", playersRef)
  //       });
  //     });


	$scope.counter = 90;
	var mytimeout = null; // the current timeoutID
	// actual timer method, counts down every second, stops on zero
	$scope.onTimeout = function() {
		if($scope.counter ===  0) {
			$scope.$broadcast('timer-stopped', 0);
			$timeout.cancel(mytimeout);
			return;
		}
		$scope.counter--;
		mytimeout = $timeout($scope.onTimeout, 1000);
	};
	$scope.startTimer = function() {
		mytimeout = $timeout($scope.onTimeout, 1000);
	};
	// stops and resets the current timer
	$scope.stopTimer = function() {
		$scope.$broadcast('timer-stopped', $scope.counter);
		$scope.counter = 90;
		$timeout.cancel(mytimeout);
	};
	// triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
	$scope.$on('timer-stopped', function(event, remaining) {
		if(remaining === 0) {
			console.log('your time ran out!');
		}
	});


	 var playersRef = gameInstance.child("players");
	 var messageRef = gameInstance.child("messages")
	 $scope.playerss = $firebaseArray(playersRef);
	 $scope.numPlayers = 0;

	// create an array to store each player's info
  $scope.addPlayer = function(){
  	// figure out how to pull user id info ... maybe store it on rootscope?
  	var thisPlayer = Date.now();
  	localStorage.player = thisPlayer;
  	console.log("this player logged In", thisPlayer)
  	playersRef.child(thisPlayer).set({thisPlayer: thisPlayer})
  }
  if (!localStorage.thisPlayer){
  	$scope.addPlayer();
  }

  //remove players
  $scope.removePlayer = function(){
  	localStorage.removeItem("player");
  	playersRef.
  	console.log("REMOVED");
  }

//add player to waiting room when they click join
	 playersRef.on("child_added", function() {
        $timeout(function() {
          $scope.numPlayers ++;
          console.log("current Players", $scope.playerss)
        });
      });

	 //update number of players when a player quits
      playersRef.on("child_removed", function() {
        $timeout(function() {
          $scope.numPlayers -= 1;
          console.log("PLAYER QUIT", playersRef)
        });
      });


  // Keep track of when the logged-in user in connected or disconnected from Firebase
  // $scope.rootRef.child(".info/connected").on("value", function(dataSnapshot) {
  //   if (dataSnapshot.val() === true) {
  //     // Remove the user from the logged-in users list when they get disconnected
  //     var loggedInUsersRef = $scope.rootRef.child("loggedInUsers/" + $scope.authData.provider + "/" + $scope.authData.uid);
  //     loggedInUsersRef.onDisconnect().remove();

  //     // Add the user to the logged-in users list when they get connected
  //     var username = ($scope.authData.provider === "github") ? $scope.authData.github.username : $scope.authData.twitter.username;
  //     loggedInUsersRef.set({
  //       imageUrl: ($scope.authData.provider === "github") ? $scope.authData.github.cachedUserProfile.avatar_url : $scope.authData.twitter.cachedUserProfile.profile_image_url_https,
  //       userUrl: ($scope.authData.provider === "github") ?  "https://github.com/" + username : "https://twitter.com/" + username,
  //       username: username
  //     });
  //   }
	$scope.startingHand = function(user){
		for(var i = 0; i<10; i++){
			var rando = Math.floor(Math.random() * (whiteCards.length - 0)) + 0;
			$scope.whiteCards.$add(whiteCards[rando])
			$scope.whiteCards.splice(rando, 1)
		}
		console.log($scope.whiteCards.length);
		$scope.blackCards = blackCards;
		var deal = Math.floor(Math.random() * ($scope.blackCards.length - 0)) + 0;
		console.log($scope.blackCards[deal])
	}

	$scope.startDeck = function(user){
			$scope.whiteCards.$add(whiteCards)
			$scope.blackCards.$add(blackCards)
	}


	//var syncObject = $firebaseObject(ref);
	// synchronize the object with a three-way data binding
	//syncObject.$bindTo($scope, "data");



	// create a synchronized array
	$scope.messages = $firebaseArray(messageRef);
	// add new items to the array
	// the message is automatically added to our Firebase database!
	$scope.addMessage = function(message) {
		// console.log($scope.newMessageText);
		console.log(message);
		$scope.messages.$add({
			text: message
		});
	};

});
