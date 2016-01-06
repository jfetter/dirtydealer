'use strict';

var app = angular.module('socialMockup');

app.service('UserService', function($http, ENV){
	this.register = function(user){
		return $http.post(`${ENV.API_URL}`/routes/registration)
	};
	this.login = function(user){
		return $http.post(`${ENV.API_URL}`/routes/login)
	};
})
