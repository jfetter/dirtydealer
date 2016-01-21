'use strict';

angular.module('cardsAgainstHumanity')

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

		UserService.register(user)
		.then(function(data){
			swal({
				type: "success",
				title: "Successful registration!",
				text: "Hurray. You're a User!",
				imageUrl: "images/thumbs-up.jpg"
			});
			$state.go('login');
		}, function(err){
			console.log(err);
		});
	}
});
