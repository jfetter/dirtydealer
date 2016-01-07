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
		.state('userPage', {url: '/userpage/{userId}', templateUrl: 'views/user/userPage/userPage.html', controller: 'userPageCtrl'})
})
