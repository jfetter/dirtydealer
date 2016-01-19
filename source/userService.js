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
