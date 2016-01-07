'use strict';

angular.module('socialMockup')
.controller('userPageCtrl', function($scope, $state,$cookies,  $cookieStore){
	console.log($cookies.get('token'));
});
