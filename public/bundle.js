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
		.state('userPage', {url: '/userpage/{username}', templateUrl: 'views/user/userPage/userPage.html', controller: 'userPageCtrl'})
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
	this.page = function(username){
		return $http.get(`${ENV.API_URL}/user/page/${username}`)
	this.auth = function(){
		return $http.get(`${ENV.API_URL}/auth`)
	}
}
})

'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){

			console.log('res: , ', res)
			$state.go('home');

			var token = $cookies.get('token');
      console.log('res: , ', res)
      var decoded = jwtHelper.decodeToken(token);
      for (var keys in decoded){

        if(keys === 'isAdmin'){
          console.log('If')

          decoded[keys] ? $rootScope.isAdmin = true : $rootScope.isAdmin = 'bananas'
        } else{
        console.log('Else')
        localStorage[`${keys}`] = decoded[keys]
        }
      }


		}, function(err) {
			console.error(err);
		});
	}
});

'use strict';

angular.module('socialMockup')
.controller('homeCtrl', function($scope){
	console.log('homeCtrl');

})

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


.controller('userPageCtrl', function($scope, $state, UserService){
	UserService.page($state.params.username)
	.then(function(res) {
		console.log("PARAMS", $state.params.name)
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
