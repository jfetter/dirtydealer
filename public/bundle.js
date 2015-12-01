'use strict';

var app = angular.module('scaffoldApp', ['ui.router'])


.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('home', {url: '/', templateUrl: 'views/home/home.html', controller: 'homeCtrl'})
})

'use strict';

angular.module('scaffoldApp')
.controller('homeCtrl', function($scope){
	console.log('homeCtrl');
	
})
