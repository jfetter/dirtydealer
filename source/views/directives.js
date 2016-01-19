"use strict";

angular.module("socialMockup")

.directive('gameTimer', function() {
  return {
    templateUrl: "game/timer.html"
  };
})

.directive('dealCards', function() {
  return {
    templateUrl: "game/cards.html"
  };
})
