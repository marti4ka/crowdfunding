var app = angular.module('Voting', ['ui.bootstrap'])

app.controller('MainController', function($scope, $http) {
    $scope.userId = {}
    $scope.disabled = false

    $scope.submit = function() {
      $scope.user.investments = {}
      $scope.ideas.forEach(function(idea) {
        if (idea.userInvestment && idea.userInvestment > 0) {
          $scope.user.investments[idea.key] = idea.userInvestment
        }
      })

      $http.put(getUserUrl(), JSON.stringify($scope.user), {headers: { "Content-Type": "application/json" }})
      .success(function(res) {
        $scope.user = ""
        $scope.success = true
      })
    }

    function getUserUrl() {
      return 'https://croudfunding.cfapps.sap.hana.ondemand.com/ideas/' + $scope.userId.value.toLowerCase()
    }

    $scope.getData = function() {
      Promise.all([getUser(), getIdeas()]).then(function(results) {
        console.log(results)
        $scope.user = results[0]
        $scope.ideas = fillUserInvestment(results[1].rows)
        $scope.$apply()
      })
    }

    getUser = function() {
      return new Promise(function(resolve, reject){
        var url = getUserUrl()
        $http.get(url).success(function(res) {
          resolve(res)
        }).error(function() {
          resolve(JSON.parse('{ "type": "user", "investments": { } }'))
        })
      })
    }

    getIdeas = function() {
      return new Promise(function(resolve, reject){
        var url = 'https://croudfunding.cfapps.sap.hana.ondemand.com/ideas/_design/views/_view/allideas?group_level=1'
        $http.get(url).success(function(res) {
          resolve(res)
        }).error(function() {
          reject()
        })
      })
    }

    fillUserInvestment = function(ideas) {
      ideas.forEach(function(idea) {
        if (!$scope.user.investments[idea.key]) {
          idea.userInvestment = 0
        } else {
          idea.userInvestment = $scope.user.investments[idea.key]
        }
      })
      return ideas
    }

    $scope.validate = function() {
      var sum = 0
      $scope.ideas.forEach(function(idea) {
        if (idea.userInvestment && parseInt(idea.userInvestment) > 0) {
          sum += parseInt(idea.userInvestment)
        }
      })
      $scope.disabled = sum > 100
      $scope.success = false
    }

})
