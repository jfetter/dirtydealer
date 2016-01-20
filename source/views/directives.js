"use strict";

angular.module("socialMockup")

.directive('gameTimer', function() {
  return {
    // restrict: "EA",
    templateUrl: "game/timer.html",
    scope: {
      text: 'ettsts'
    }
  };
})

.directive('dealCards', function() {
  return {
    templateUrl: "game/cards.html"
  };
})
