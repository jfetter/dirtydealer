'use strict';

angular.module('socialMockup')


.controller('userPageCtrl', function($scope, $state, UserService, $cookies, jwtHelper, $location , $base64 ){
	$scope.user = {};
	var cookies = $cookies.get('token');
	var token = jwtHelper.decodeToken(cookies)
	UserService.page($state.params.username)
	.then(function(res) {
		console.log("PARAMS", $state.params.name)
		console.log(res.data.favorites)
		$scope.user = res.data;
		$scope.favorites = res.data.favorites;
		$scope.isOwnPage = $scope.user.username ===token.username
    if(res.data.avatar){
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`
    } else { 
      $scope.profileImageSrc = `http://gitrnl.networktables.com/resources/userfiles/nopicture.jpg`
    }

	}, function(err) {
		console.error(err)
	});

  

  $scope.uploadImage = function(image){
    console.log(image)
    UserService.uploadImage(image, $scope.user._id)
    .then(function(res){
      console.log(res.data)
      $scope.profileImageSrc = `data:image/jpeg;base64,${res.data.avatar}`;
      console.log($scope.profileImageSrc)
      
    })
    
  }

	$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: `/imageUpload`,
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
        }
    }
	// $scope.isOwnPage = false;
	// $scope.imageAvailable = false;

// 	= function(){
// 		console.log('scope.user.username', $scope.user);
// 		console.log('token user', token);
// 		if($scope.user.username){return $scope.user.username ===token.username}
// 		else{return false}
// }
	$scope.exposeData = function(){console.log($scope.myFile)}
	UserService.isAuthed(cookies)
	.then(function(res , err){
		console.log(res.data)
		 if (res.data === "authRequired"){$location.path('/login')}
		 else{$scope.isLoggedIn = true;}
	})


});
