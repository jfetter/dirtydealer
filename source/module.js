'use strict';

var app = angular.module('socialMockup', ['ui.router', 'angular-jwt', 'ngCookies'])


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
		.state('usersList', {url: '/userslist', templateUrl: 'views/user/usersList/usersList.html', controller: 'usersListCtrl'})
		.state('userPage', {url: '/userpage/{username}', templateUrl: 'views/user/userPage/userPage.html', controller: 'userPageCtrl'})
})

app.controller('MasterController', function(UserService, $cookies, jwtHelper, $scope, $state, $rootScope){
  var cookies = $cookies.get('token');
  if(cookies){
    $scope.userInfo = (jwtHelper.decodeToken(cookies))
  }
  UserService.isAuthed(cookies)
  .then(function(res , err){
    console.log(res.data)
    if (res.data !== "authRequired"){
    // $state.go('usersList');
    $scope.isLoggedIn = true;
    console.log("LOGGED IN!")
  }
  })
  $scope.$on('loggedIn', function(){
    $scope.isLoggedIn = true;
  })

  $scope.logout = function(){
    $cookies.remove('token');
    $state.go('login')
    $scope.isLoggedIn = false;
  }
})
