'use strict';

var app = angular.module('socialMockup', ['ui.router', 'angular-jwt', 'ngCookies','naif.base64', "base64"])


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

app.controller('MasterController', function(UserService, $cookies, jwtHelper, $scope, $state, $rootScope){
  var cookies = $cookies.get('token');
  var username;
  if(cookies){
    $scope.userInfo = (jwtHelper.decodeToken(cookies))
  }

  UserService.isAuthed(cookies)
  .then(function(res , err){
    console.log(res.data)
    if (res.data !== "authRequired"){
    $state.go('usersList');
    $scope.isLoggedIn = true;
    console.log("LOGGED IN!")
  } else {
    $scope.isLoggedIn = false;
    $state.go('login');
  }
  })
  $scope.$on('loggedIn', function(){
    $scope.isLoggedIn = true;
    var cookies = $cookies.get('token');
    if(cookies){
      console.log("in cookis if")
      $scope.userInfo = (jwtHelper.decodeToken(cookies))
    }
    username = $scope.userInfo.username

  })
  $scope.$on('edit', function(event, data){
    console.log('e:', event);
    console.log('d:', data);
    console.log("New:", data._id)
    console.log("Old", $scope.userInfo._id)
    if(!$scope.userInfo.isAdmin || data._id === $scope.userInfo._id){
      $scope.userInfo = data;
      username = $scope.userInfo.username
      console.log("NEWUSERNAME!!!!!", username)
    }
  })

  $scope.logout = function(){
    $cookies.remove('token');
    $state.go('login')
    $scope.isLoggedIn = false;
  }
  $scope.goHome = function(){
    var username = $scope.userInfo.username
    console.log("ISUSERNAME", username)
    $state.go('userPage', {"username": username})
  }
})

'use strict';

var app = angular.module('socialMockup');

app.service('UserService', function($http, ENV, $location, $rootScope, $cookies, jwtHelper){
	this.register = function(user){
		console.log(user)
		return $http.post(`https://fathomless-thicket-1878.herokuapp.com/register`, user);
	};
	this.login = function(user){
		return $http.post(`https://fathomless-thicket-1878.herokuapp.com/login`, user);
	};
	this.list = function(){
		return $http.get(`https://fathomless-thicket-1878.herokuapp.com/user/list`);
	};
	this.page = function(username){
		return $http.get(`https://fathomless-thicket-1878.herokuapp.com/user/page/${username}`)
	}
	this.auth = function(){
		return $http.get(`https://fathomless-thicket-1878.herokuapp.com/auth`)
	};
	this.favoriteUser = function(userId){
		var data = {};
		var decoded = (jwtHelper.decodeToken($cookies.get('token')))
		data.myId = decoded._id;
		data.favoriteId = userId
		return $http.put(`https://fathomless-thicket-1878.herokuapp.com/user/favorite`, data)
	};
	this.editAccount = function(data){
		return $http.post(`https://fathomless-thicket-1878.herokuapp.com/user/edit`, data)
	}
	this.unFavoriteUser = function(userId){
		console.log(userId)
		var data = {};
		var decoded = (jwtHelper.decodeToken($cookies.get('token')))
		data.myId = decoded._id;
		data.unFavoriteId = userId
		console.log("MYID", data.myId)
		console.log("THEIRID", data.unFavoriteId)
		return $http.put(`https://fathomless-thicket-1878.herokuapp.com/user/unfavorite`, data)
	}
	this.eraseUser = function(userId){
		console.log("USERID", userId)
		var data = {};
		data.userId = userId
		return $http.post(`https://fathomless-thicket-1878.herokuapp.com/user/erase`, data)
	}
	this.loggedIn = function(isLoggedIn){
			if(isLoggedIn){ return true }
	};
  this.uploadImage = function(image, userId){
    return $http.post(`https://fathomless-thicket-1878.herokuapp.com/imageUpload`, {
      userId: userId,
      image: image
    })
  }
	this.isAuthed = function(token){
		return $http.post(`https://fathomless-thicket-1878.herokuapp.com/auth`, {token:token})
	};
})

'use strict';

angular.module('socialMockup')
.controller('homeCtrl', function($scope){
	console.log('homeCtrl');

})

'use strict';

angular.module('socialMockup')
.controller('loginCtrl', function($scope, $state, $rootScope, UserService, jwtHelper, $cookies){
	$scope.submit = function(user){
		UserService.login(user)
		.then(function(res){

			console.log('res', res.data)
			if(res.data=="login succesfull"){
						// console.log("EUSER", user)
						UserService.loggedIn = 'true';
						$scope.$emit('loggedIn');
						$state.go('userPage', {"username": user.username})
			} else if (res.data === "Incorrect Username or Password!"){
			swal({
				type: "error",
				title: "Uh-Oh!",
				text: res.data,
				showConfirmButton: true,
				confirmButtonText: "I hear ya.",
			});
      }
			var token = $cookies.get('token');
      var decoded = jwtHelper.decodeToken(token);
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
			swal({
				type: "warning",
				title: "Passwords don't match!",
				text: "Matching passwords only please",
				showConfirmButton: true,
				confirmButtonText: "Gotcha.",
			});
			return;
		}

		if(!user.email){
			swal({
				type: "error",
				title: "Give us your email address!",
				text: "C'mon, we know that's a fake!",
				showConfirmButton: true,
				confirmButtonText: "I hear ya.",
			});
			return;
		}

		// if("username or email already exists"){
		// 	swal({
		// 		type: "error",
		// 		title: "Give us your email address!",
		// 		text: "C'mon, we know that's a fake!",
		// 		showConfirmButton: true,
		// 		confirmButtonText: "I hear ya.",
		// 	});
		// 	return;
		// }

		UserService.register(user)
		.then(function(data){
			swal({
				type: "success",
				title: "Successful registration!",
				text: "Hurray. You're a User!",
				imageUrl: "images/thumbs-up.jpg"
			});			$state.go('login');
		}, function(err){
			console.log(err);
		});
	}
});

'use strict';

angular.module('socialMockup')


.controller('usersListCtrl', function($scope, $location, $rootScope, $state, $cookies, UserService, jwtHelper){
	var cookies = $cookies.get('token');
	if(cookies){
		$scope.userInfo = (jwtHelper.decodeToken(cookies))
	}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		// console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})
	UserService.list()
	.then(function(res) {
		users = res.data;
		$scope.users = users;
	}, function(err) {
		console.error(err)
	});
	var users;

	$scope.$watch(function(){return $scope.searchTerm}, function(n,o){
		$scope.updateSearch();
	})

	$scope.addFavorite = function (userId){
		UserService.favoriteUser(userId)
		.then(function(res){
			$scope.userInfo = (jwtHelper.decodeToken(res.data))
		})
	}
	$scope.removeFavorite = function (userId){
		UserService.unFavoriteUser(userId)
		.then(function(res){
			$scope.userInfo = (jwtHelper.decodeToken(res.data))
		})
	}
	$scope.eraseUser = function (userId){
		UserService.eraseUser(userId)
		.then(function(res){
			$scope.users = res.data
			users = res.data
		})
	}

	$scope.favorited = function(user){
		// console.log("USER", user);
		if (user._id !== $scope.userInfo._id){
			return ($scope.userInfo.favorites).some(function(favorite){
				return (user._id === favorite)
			})
		} else {return true}
	}
	$scope.isUser = function(user){
		// console.log("USER", user);
		if (user._id !== $scope.userInfo._id){
				return (false)
		} else {return true}
	}
		$scope.isAdmin = $scope.userInfo.isAdmin;

	$scope.updateSearch = function(searchTerm){
		// $scope.searchTerm = searchTerm
		console.log(searchTerm)
		if(searchTerm){
			console.log(searchTerm)
		$scope.users = $scope.users.filter(function(user){
			if (user.username.match(searchTerm)){
				return true
			} else{
				return false
			}
		})
		} else{
			$scope.users = users
		}
	}
})

'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64){
	$scope.user = {};
	$scope.editPayload = {};
	var cookies = $cookies.get('token');
	var token = jwtHelper.decodeToken(cookies)
	// if(cookies){
	// 	$scope.userInfo = (jwtHelper.decodeToken(cookies))
	// }
	console.log("COOKIES", cookies)
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){
			 $location.path('/login')
		 } else{$scope.isLoggedIn = true;}
	})
	UserService.page($state.params.username)
	.then(function(res) {
		console.log("PARAMS", $state.params.name)
		console.log(res.data.favorites)
		$scope.user = res.data;
		$scope.favorites = res.data.favorites;
		$scope.isOwnPage = $scope.user.username === token.username || token.isAdmin === true;
		$scope.isEditing = false;
		$scope.editPayload.username = $scope.user.username;
		$scope.editPayload.email = $scope.user.email;

		$scope.editPayload.phone = $scope.user.phone;
		$scope.editPayload.name = $scope.user.name
		$scope.editPayload.address = $scope.user.address
		$scope.editPayload._id = $scope.user._id
		$scope.editPayload.isAdmin = token.isAdmin

		if ($scope.user.phone ==0){
			console.log("number is zero")
			$scope.hasNoPhoneNumber = true;
			console.log($scope.hasNoPhoneNumber)
		}

    console.log($scope.isEditing)
		console.log("edit Payload", $scope.editPayload)
		console.log('token:',token);
		console.log('scope user username: ', $scope.user.username);
    if(res.data.avatar){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`
    } else {
      $scope.profileImageSrc = `http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg`
    }

	}, function(err) {
		console.error(err)
	});
  $scope.test = function(){
    console.log("TESTING")
  }
	$scope.removeFavorite = function (userId){
		UserService.unFavoriteUser(userId)
		.then(function(res){
			console.log(res.data)
			$scope.userInfo = res.data
			var cookie = $cookies.get('token');
			var token = jwtHelper.decodeToken(cookie);
			console.log("TOKEN: ",token)
			console.log("INFO: ",$scope.userInfo)
			$scope.favorites = $scope.userInfo.favorites;
		})
	}

	$scope.toggleEdit = function(){
    console.log($scope.isEditing)
		$scope.isEditing = !$scope.isEditing
	}

	$scope.saveEdits = function(){
		console.log("save edits!!!!!" , $scope.editPayload);
		if(!$scope.editPayload.phone){$scope.editPayload.phone = 0};
		if(!$scope.editPayload.address){$scope.editPayload.address = ""};
		UserService.editAccount($scope.editPayload)

		.then(function(response){
			$scope.$emit('edit', response.data)
			$scope.user = response.data;
			$scope.isEditing = !$scope.isEditing;
			console.log(response.data, "received")
		})

	}

  $scope.uploadImage = function(image){
    console.log(image)
    UserService.uploadImage(image, $scope.user._id)
    .then(function(res){
      console.log(res.data)
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;
      console.log($scope.profileImageSrc)

    })
  }




	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})

});
