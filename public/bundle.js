'use strict';

var app = angular.module('socialMockup', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', "base64", "firebase"])

app.constant('ENV', {
  API_URL: 'http://localhost:3000'
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('home', {url: '/', templateUrl: 'views/home/home.html', controller: 'homeCtrl'})
		.state('login', {url: '/login', templateUrl: 'views/login/login.html', controller: 'loginCtrl'})
		.state('register', {url: '/register', templateUrl: 'views/register/register.html', controller: 'registerCtrl'})
		.state('game', {url: '/game', templateUrl: 'views/game/game.html', controller: 'gameCtrl'})
		.state('userPage', {url: '/userpage/{username}', templateUrl: 'views/userPage/userPage.html', controller: 'userPageCtrl'})
})

app.controller('MasterController', function(UserService, $cookies, jwtHelper, $scope, $state, $rootScope){
  var cookies = $cookies.get('token');
  var username;
  if(cookies){
    $scope.userInfo = (jwtHelper.decodeToken(cookies))
  }

  UserService.isAuthed(cookies)
  .then(function(res , err){
    console.log(res.data)
    if (res.data !== "authRequired"){
      $state.go('userPage', {"username": res.data.username})
    $scope.isLoggedIn = true;
    console.log("LOGGED IN!")
  } else {
    $scope.isLoggedIn = false;
    $state.go('login');
  }
  })
  $scope.$on('loggedIn', function(){
    $scope.isLoggedIn = true;
    var cookies = $cookies.get('token');
    if(cookies){
      console.log("in cookis if")
      $scope.userInfo = (jwtHelper.decodeToken(cookies))
    }
    username = $scope.userInfo.username

  })
  $scope.$on('edit', function(event, data){
    console.log('e:', event);
    console.log('d:', data);
    console.log("New:", data._id)
    console.log("Old", $scope.userInfo._id)
    if(!$scope.userInfo.isAdmin || data._id === $scope.userInfo._id){
      $scope.userInfo = data;
      username = $scope.userInfo.username
      console.log("NEWUSERNAME!!!!!", username)
    }
  })

  $scope.logout = function(){
    $cookies.remove('token');
    $state.go('login')
    $scope.isLoggedIn = false;
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    console.log("ISUSERNAME", username)
    $state.go('userPage', {"username": username})
  }
})

'use strict';

var app = angular.module('socialMockup');

app.service('UserService', function($http, $firebaseObject, $firebaseArray, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.register = function(user){
		console.log(user)
		return $http.post(`${ENV.API_URL}/register`, user);
	};
	this.login = function(user){
		return $http.post(`${ENV.API_URL}/login`, user);
	};
	this.list = function(){
		return $http.get(`${ENV.API_URL}/user/list`);
	};
	this.page = function(username){
		return $http.get(`${ENV.API_URL}/user/page/${username}`)
	}
	this.auth = function(){
		return $http.get(`${ENV.API_URL}/auth`)
	};
	this.editAccount = function(data){
		return $http.post(`${ENV.API_URL}/user/edit`, data)
	}
	this.loggedIn = function(isLoggedIn){
			if(isLoggedIn){ return true }
	};
  this.uploadImage = function(image, userId){
    return $http.post(`${ENV.API_URL}/imageUpload`, {
      userId: userId,
      image: image
    })
  }
	this.isAuthed = function(token){
		return $http.post(`${ENV.API_URL}/auth`, {token:token})
	};
})
'use strict';

var app = angular.module('socialMockup');

app.service('GameService', function($http, $rootScope, ENV, $location, $firebaseObject, $firebaseArray, $cookies){
	var ref = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com/");

	// this.cards = function(){
	// 	// return $http.get('source/json/whiteCards.json');
	// 	console.log(whiteCards)
	// }

 // waiting state
 // display `waiting for players message`
 //accumulate users, when there are enough users start game.

	// $scope.players = $firebaseArray(ref);





////pre vote state/////
	 //initialize gameService

	 // start turn timer

	 //pull a black card from `deck`

	 //deal hand of white cards



})

"use strict";

angular.module("socialMockup")

.directive('gameTimer', function() {
  return {
    templateUrl: "game/timer.html"
  };
})

.directive('dealCards', function() {
  return {
    templateUrl: "game/cards.html"
  };
})

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

	$scope.getCards = function(user){
		$scope.whiteCards = whiteCards;
		for(var i = 0; i<10; i++){
			var rando = Math.floor(Math.random() * ($scope.whiteCards.length - 0)) + 0;
			console.log($scope.whiteCards[rando])
			$scope.whiteCards.splice(rando, 1)
		}
		console.log($scope.whiteCards.length);
		$scope.blackCards = blackCards;
		var deal = Math.floor(Math.random() * ($scope.blackCards.length - 0)) + 0;
		console.log($scope.blackCards[deal])
	}

	//******FIREBASE
	//create a new game instance on the scope
	$scope.gameInstance = new Firebase("https://cardsagainsthumanity-ch.firebaseio.com");
	 // set up a reference for all of the players currently in this game instance
	 var playersRef = $scope.gameInstance.child("players");
	 var messageRef = $scope.gameInstance.child("messages")

	 $scope.numPlayers = 0;

	// create an array to store each player's info
  $scope.playerss = $firebaseArray(playersRef);
  $scope.addPlayer =function(){
  	// figure out how to pull user id info ... maybe store it on rootscope?
  	var thisPlayer = cookies;
  	console.log("this player logged In", thisPlayer)
  	$scope.playerss.$add({
  		id: thisPlayer
  	})
  }

	 playersRef.on("child_added", function() {
        $timeout(function() {
          $scope.numPlayers ++;
          console.log("PLAYER JOINED", $scope.numPlayers)
        });
      });
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

'use strict';

angular.module('socialMockup')
.controller('homeCtrl', function($scope){
	console.log('homeCtrl');

})

'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){

			console.log('res', res.data)
			if(res.data=="login succesfull"){
				UserService.loggedIn = 'true';
				$scope.$emit('loggedIn');
				$state.go('userPage', {"username": user.username})
			} else if (res.data === "Incorrect Username or Password!"){
				swal({
					type: "error",
					title: "Uh-Oh!",
					text: res.data,
					showConfirmButton: true,
					confirmButtonText: "I hear ya.",
				});
			}
			var token = $cookies.get('token');
			var decoded = jwtHelper.decodeToken(token);
		}, function(err) {
			console.error(err);
		});
	}

});

'use strict';

angular.module('socialMockup')

.controller('registerCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		console.log(user)
		if(user.password !== user.password2){
			swal({
				type: "warning",
				title: "Passwords don't match!",
				text: "Matching passwords only please",
				showConfirmButton: true,
				confirmButtonText: "Gotcha.",
			});
			return;
		}

		UserService.register(user)
		.then(function(data){
			swal({
				type: "success",
				title: "Successful registration!",
				text: "Hurray. You're a User!",
				imageUrl: "images/thumbs-up.jpg"
			});
			$state.go('login');
		}, function(err){
			console.log(err);
		});
	}
});

'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64){
	$scope.user = {};
	$scope.editPayload = {};
	var cookies = $cookies.get('token');
	var token = jwtHelper.decodeToken(cookies)
	console.log("COOKIES", cookies)
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){
			 $location.path('/login')
		 } else{$scope.isLoggedIn = true;}
	})

	UserService.page($state.params.username)
	.then(function(res) {
		$scope.user = res.data;
		$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
		$scope.isEditing = false;
		$scope.editPayload.username = $scope.user.username;
		$scope.editPayload._id = $scope.user._id

    console.log($scope.isEditing)
		console.log("edit Payload", $scope.editPayload)
		console.log('token:',token);
		console.log('scope user username: ', $scope.user.username);
    if(res.data.avatar){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`
    } else {
      $scope.profileImageSrc = `http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg`
    }

	}, function(err) {
		console.error(err)
	});

	$scope.toggleEdit = function(){
    console.log($scope.isEditing)
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		console.log("save edits!!!!!" , $scope.editPayload);
		UserService.editAccount($scope.editPayload)
		.then(function(response){
			$scope.$emit('edit', response.data)
			$scope.user = response.data;
			$scope.isEditing = !$scope.isEditing;
			console.log(response.data, "received")
		})
	}

  $scope.uploadImage = function(image){
    console.log(image)
    UserService.uploadImage(image, $scope.user._id)
    .then(function(res){
      console.log(res.data)
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;
      console.log($scope.profileImageSrc)
    })
  }

	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
});
