'use strict';

var app = angular.module('socialMockup');

app.service('UserService', function($http, ENV, $location, $rootScope){
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
	};
	this.auth = function(userInfo){
		return $http.get(`${ENV.API_URL}/auth`)
	};
	this.loggedIn = function(isLoggedIn){
			if(isLoggedIn){ return true }
	};
	this.isAuthed = function(token){
		return $http.post(`${ENV.API_URL}/auth`, {token:token})
	}


})
