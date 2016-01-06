'use strict';

var app = angular.module('socialMockup', ['ui.router'])


app.constant('ENV', {
  API_URL: 'https://localhost:3000'
});


app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('home', {url: '/', templateUrl: 'views/home/home.html', controller: 'homeCtrl'})
		.state('login', {url: '/login', templateUrl: 'views/login/login.html', controller: 'loginCtrl'})
		.state('register', {url: '/register', templateUrl: 'views/register/register.html', controller: 'registerCtrl'})
})

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

'use strict';

angular.module('socialMockup')
.controller('homeCtrl', function($scope){
	console.log('homeCtrl');

})

'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){
			$state.go('home.index');
		}, function(err) {
			console.error(err);

		});
	}
});

'use strict';

angular.module('socialMockup')

.controller('registerCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		if(user.password !== user.password2){
			alert('Passwords do not match');
			return;
		}
		UserService.register(user)
		.then(function(data){
			alert('You have sucessfully registered');
				$state.go('login');
		}, function(err){
			console.log(err);
		});
	}
});
