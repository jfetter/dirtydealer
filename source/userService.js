'use strict';

var app = angular.module('socialMockup');

app.service('UserService', function($http, ENV){
	this.register = function(user){
		console.log(user)
		return $http.post(`${ENV.API_URL}/register`, user)
	};
	this.login = function(user){
		return $http.post(`${ENV.API_URL}/login`, user)
	};
	this.auth = function(){
		return $http.get(`${ENV.API_URL}/auth`)
	}
})
