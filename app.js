var app = angular.module('Voting', ['ui.bootstrap']);

app.controller('MainController', function($scope, $http) {
    $scope.userId = {};
    $scope.disabled = false;

    $scope.submit = function() {
      $scope.user.investments = {};
      $scope.ideas.forEach(function(idea) {
        if (idea.userInvestment && idea.userInvestment > 0) {
          $scope.user.investments[idea.key] = idea.userInvestment;
        }
      });

      console.log(JSON.stringify($scope.user))
      $http.post(getUserUrl(), JSON.stringify($scope.user)).success(function() {
        $scope.userId = "";
      });

      // kazva se na usera, 4e e gotov i se skriva tablicata

    }

    function getUserUrl() {
      return 'https://croudfunding.cfapps.sap.hana.ondemand.com/ideas/' + $scope.userId.value.toLowerCase();
    }

    $scope.getUser = function() {
      var url = getUserUrl();
      console.log(getUserUrl());
      $http.get(url).success(function(data) {
        $scope.user = JSON.parse(data);
      }).error(function() {
        $scope.user = JSON.parse('{ "type": "user", "investments": { "6b858172efca3c828ca20d0c04000fb1": 10 } }');
      })
    }

    $scope.getIdeas = function() {
      var url = 'https://croudfunding.cfapps.sap.hana.ondemand.com/ideas/_design/views/_view/allideas?group_level=1';
      $http.get(url).success(function(data) {
        $scope.ideas = fillUserInvestment(JSON.parse(data).rows);
      }).error(function() {
        $scope.ideas = fillUserInvestment(JSON.parse('{"rows":[{"key":"6b858172efca3c828ca20d0c04000fb1","value":{"_id":"6b858172efca3c828ca20d0c04000fb1","_rev":"2-1f608b92668662937e3e4e10ef515557","name":"Consistent UX across Tools - Cross-Tool Angular Library with reusable components based on UX guidelines","url":"https://sapjira.wdf.sap.corp/browse/TOOLSIDEAS-4","type":"idea","invested":70}},{"key":"6b858172efca3c828ca20d0c04001736","value":{"_id":"6b858172efca3c828ca20d0c04001736","_rev":"2-aa4bf9be779d81c753c3a4ef9c14a439","name":"Intelligent Customer Care","url":"https://sapjira.wdf.sap.corp/browse/TOOLSIDEAS-9","type":"idea","invested":0}}]}').rows);
        // $scope.ideas = JSON.parse('{"rows":[{"key":"6b858172efca3c828ca20d0c04000fb1","value":{"_id":"6b858172efca3c828ca20d0c04000fb1","_rev":"2-1f608b92668662937e3e4e10ef515557","name":"Consistent UX across Tools - Cross-Tool Angular Library with reusable components based on UX guidelines","url":"https://sapjira.wdf.sap.corp/browse/TOOLSIDEAS-4","type":"idea","invested":70}},{"key":"6b858172efca3c828ca20d0c04001736","value":{"_id":"6b858172efca3c828ca20d0c04001736","_rev":"2-aa4bf9be779d81c753c3a4ef9c14a439","name":"Intelligent Customer Care","url":"https://sapjira.wdf.sap.corp/browse/TOOLSIDEAS-9","type":"idea","invested":0}}]}');
      });
    }

    fillUserInvestment = function(ideas) {
      ideas.forEach(function(idea) {
        if (!$scope.user.investments[idea.key]) {
          idea.userInvestment = 0;
        } else {
          idea.userInvestment = $scope.user.investments[idea.key];
        }
      });
      return ideas;
    }

    $scope.validate = function() {
      var sum = 0;
      $scope.ideas.forEach(function(idea) {
        if (idea.userInvestment && idea.userInvestment > 0) {
          sum += idea.userInvestment;
        }
      });
      $scope.disabled = sum > 100;
    }

});
