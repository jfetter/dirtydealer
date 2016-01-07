'use strict';

var app = angular.module('socialMockup', ['ui.router', 'ngCookies'])


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
		.state('userPage', {url: '/userpage', templateUrl: 'views/user/userPage/userPage.html', controller: 'userPageCtrl'})
})

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
			console.log('res: , ', res)
			
		}, function(err) {
			console.error(err);
		});
	}
});

'use strict';

angular.module('socialMockup')

.controller('registerCtrl', function($scope, $state, UserService){
	$scope.submit = function(user){
		console.log(user)
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

// app.module('socialMockup')
//    .service()

'use strict';

angular.module('socialMockup')

.controller('usersList', function($scope, $state){
	console.log("userCtrl")
});

'use strict';

angular.module('socialMockup')

.controller('usersListCtrl', function($scope, $state){
	console.log("userList")
});

'use strict';

angular.module('socialMockup')
.controller('userPageCtrl', function($scope, $state,$cookies,  $cookieStore){
	console.log($cookies.get('token'));
});
