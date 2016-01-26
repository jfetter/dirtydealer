'use strict';

var app = angular.module('cardsAgainstHumanity', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', "base64", "firebase"])

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
		.state('game', {url: '/game', templateUrl: 'views/game/game.html', controller: 'gameMasterCtrl'})
		.state('userPage', {url: '/userpage/{username}', templateUrl: 'views/userPage/userPage.html', controller: 'userPageCtrl'})
})

app.controller('MasterController', function(UserService, $cookies, jwtHelper, $scope, $state, $rootScope, GameService){
  var cookies = $cookies.get('token');
  var username;
  if(cookies){
    $scope.userInfo = (jwtHelper.decodeToken(cookies))
  }

  UserService.isAuthed(cookies)
  .then(function(res , err){
    console.log(res.data)
    if (res.data !== "authRequired"){
      // $state.go('userPage', {"username": res.data.username})
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
    GameService.removePlayer();
    $cookies.remove('token');
    if (localStorage.playing){localStorage.removeItem('player')}
    $state.go('login')
    $scope.isLoggedIn = false;
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    console.log("ISUSERNAME", username)
    $state.go('userPage', {"username": username})
  }
})
