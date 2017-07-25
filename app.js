var app = angular.module('Voting', ['ui.bootstrap']);

app.controller('MainController', function($scope, $injector) {

    // Load all cards
    $scope.ideas = [
      {name: 'aaaaa', curr: '123', my: 10},
      {name: 'aaaaa', curr: '123', my: 10},
      {name: 'aaaaa', curr: '123', my: 10},
      {name: 'aaaaa', curr: '123', my: 10}
    ];

});
