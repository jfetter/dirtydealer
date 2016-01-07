'use strict';

var app = angular.module('socialMockup');

app.service('UserService', function($http, ENV){
	this.register = function(user){
		console.log(user)
		return $http.post(`${ENV.API_URL}/register`, user);
	};
	this.login = function(user){
		return $http.post(`${ENV.API_URL}/login`, user);
	};
<<<<<<< HEAD
	this.list = function(){
		return $http.get(`${ENV.API_URL}/user/list`);
	};
	this.page = function(userId){
		return $http.get(`${ENV.API_URL}/user/page/${userId}`)
=======
	this.auth = function(){
		return $http.get(`${ENV.API_URL}/auth`)
>>>>>>> 27c45e18ac5790f07da12666172244459dd8a9a4
	}
})
