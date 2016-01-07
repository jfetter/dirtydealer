'use strict';

var app = angular.module('socialMockup', ['ui.router'])


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
	this.list = function(){
		return $http.get(`${ENV.API_URL}/user/list`);
	};
	this.page = function(userId){
		return $http.get(`${ENV.API_URL}/user/page/${userId}`)
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
			$state.go('home');
		}, function(err) {
			console.error(err);
		});
	}
});

// app.module('socialMockup')
//    .service()

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

'use strict';

angular.module('socialMockup')

.controller('userPageCtrl', function($scope, $state, UserService){
	UserService.page($state.params.userId)
	.then(function(res) {
		console.log("PARAMS", $state.params.userId)
		$scope.user = res.data;
	}, function(err) {
		console.error(err)
	});
});

'use strict';

angular.module('socialMockup')

.controller('usersListCtrl', function($scope, $state, UserService){
	UserService.list()
	.then(function(res) {
		console.log(res.data)
		$scope.users = res.data;
	}, function(err) {
		console.error(err)
	});
});
