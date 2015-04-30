var baseUrl = "http://localhost:8080/api";

angular.module('starter.controllers', [])
.service('searchService', function() {
  var results = {};

  var setResults = function(newObj) {
      results = newObj;
  }

  var getResults = function(){
      return results;
  }

  return {
    setResults: setResults,
    getResults: getResults
  };

})
.controller('LoginCrtl', function($scope, $location, $timeout, $ionicLoading, $http) {

  // form data for the login
  $scope.loginData = {};
  $scope.loginText = "Using your Email and Password";
  $scope.loginClass = "text-muted";

  // show the loading modal to block user interaction 
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Verifying...'
    });
  };

  // hide the loading modal
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  // perform the login action when the user submits the login form
  $scope.doLogin = function() {

    if ($scope.loginData.hasOwnProperty("username") && 
      $scope.loginData.hasOwnProperty("password") &&
      $scope.loginData["username"] != "" &&
      $scope.loginData["password"] != "") {

      $scope.show(); // show loading modal
      var user = $scope.loginData["username"];
      var pass = $scope.loginData["password"];

      $http.get(baseUrl + "/user/email/" + user).then(function(resp) {
        console.log(resp.data);

        if (resp.data) {

          window.localStorage["username"] = user;
          // successful login, continue!
          $location.path("/tab/carpool");
          $scope.hide(); // hide loading modal
        }
        else {

          // failed login
          $scope.loginText = "Email and Password are incorrect";
          $scope.loginClass = "text-red";
          $scope.hide(); // hide loading modal
        }
      }, function(err) {

        // API request error
        console.error('ERR', err);
        console.error('ERR', err.status);
      });
    }
    else {
      $scope.loginText = "Email and Password are required";
      $scope.loginClass = "text-red";
    }
  };
})
.controller('SearchCtrl', function($scope, $http, $location, $timeout, $ionicLoading, searchService) {

  // form data for the login
  $scope.searchData = {};
  $scope.searchText = "Enter information to find a carpool";
  $scope.searchClass = "text-muted";

  // show the loading modal to block user interaction 
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Searching...'
    });
  };

  // hide the loading modal
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  // perform the login action when the user submits the login form
  $scope.doSearch = function(search) {

    console.log('Starting search with data: ', search);
    $scope.show();
    

    // ensure the search fields are valid
    if (search !== undefined &&
      search.hasOwnProperty("destStreet") && 
      search.hasOwnProperty("destZip") &&
      search.hasOwnProperty("time") &&
      search.destStreet != "" &&
      search.destZip != ""&&
      search.time != "") {

      var startStreet = search["startStreet"];
      var street = search["destStreet"];
      var zip = search["destZip"];
      var time = search["time"];

      // get users start address
      var user = window.localStorage["username"];
      $http.get(baseUrl + "/user/email/" + user).then(function(resp) {
        if (resp.data) {

          // get address information for this user
          $http.get(baseUrl + "/address/" + resp.data.AddrID).then(function(resp) {
            if (resp.data) {
              startStreet = resp.data.street + " " + resp.data.city + " " + resp.data.state;

              // logging because node server crashing on specific requests
              var searchUrl = baseUrl + "/carpool/search/Dec 31 1899 " + time + " GMT-0500 (EST)/" + street + "/" + zip + "/" + startStreet;
              console.log(searchUrl);
              $http.get(searchUrl).then(function(resp) {
                if (resp.data) {
                  
                  searchService.setResults(resp.data);
                  console.log(searchService.getResults());
                  $location.path("/tab/search-results");
                }
              }, function(err) {

                // API request error
                console.error('ERR', err);
                console.error('ERR', err.status);
                $scope.searchText = "Error[" + err.status + "]: Invalid request";
                $scope.searchClass = "text-red";
              });
            }
          }, function(err) {
            // API request error
            console.error('ERR', err);
            console.error('ERR', err.status);
          });
        }
      }, function(err) {
        // API request error
        console.error('ERR', err);
        console.error('ERR', err.status);
      });
    }
    else {
      $scope.searchText = "All search fields are required.";
      $scope.searchClass = "text-red";
    }
    $scope.hide(); // hide loading modal
  };
})

.controller('SearchResultsCtrl', function($scope, $http, $location, $timeout, $ionicLoading, searchService) {

  $scope.searchResults = searchService.getResults();

  $scope.viewDetails = function(ride) {
    console.log(ride);
    // go to details page & pass information
    localStorage.rideDetailsID = ride;
    $location.path("/tab/carpool-details");
  }
})

.controller('CarpoolDetailsCtrl', function($scope, $stateParams, $http, searchService) {

  $scope.rideDetailsID = localStorage.rideDetailsID;
  $scope.searchResults = searchService.getResults();
  $scope.rideDetails = null;
  $scope.dest = null;
  $scope.address = null;
  $scope.user = null;
  $scope.startAddress = null;

  for (i = 0; i < $scope.searchResults.length; i++) {
    if ($scope.searchResults[i]._id == $scope.rideDetailsID) {
      $scope.rideDetails = $scope.searchResults[i];
    }
  }

  console.log($scope.searchResults);
  console.log($scope.rideDetails);
  console.log($scope.rideDetails.DestID);
  // get address information for this user
  $http.get(baseUrl + "/destination/id/" + $scope.rideDetails.DestID).then(function(resp) {
    console.log("dest: " + resp.data);
    if (resp.data) {

      $scope.dest = resp.data;

      $http.get(baseUrl + "/address/" + $scope.dest.AddrID).then(function(resp) {
        console.log(resp.data);
        console.log("address data above");
        if (resp.data) {
          $scope.address = resp.data;
        }
      }, function(err) {

        // API request error
        console.error('ERR', err);
        console.error('ERR', err.status);
      });
    }
  }, function(err) {

    // API request error
    console.error('ERR', err);
    console.error('ERR', err.status);
  });

  // get address information for this user
  $http.get(baseUrl + "/user/id/" + $scope.rideDetails.OwnerID).then(function(resp) {
    console.log(resp.data);
    if (resp.data) {
      $scope.user = resp.data;
      $http.get(baseUrl + "/address/" + $scope.user.AddrID).then(function(resp) {
        console.log(resp.data);
        console.log("address data above");
        if (resp.data) {
          $scope.startAddress = resp.data;
        }
      }, function(err) {

        // API request error
        console.error('ERR', err);
        console.error('ERR', err.status);
      });
    }
  }, function(err) {

    // API request error
    console.error('ERR', err);
    console.error('ERR', err.status);
  });
})

.controller('DashboardCtrl', function($scope, $stateParams) {

})

.controller('ProfileCtrl', function($scope, $stateParams, $http) {

  $scope.userData = {};
  $scope.address  = {};
  $scope.isEditMode = false;

  var user = window.localStorage["username"];

  // get base user information
  $http.get(baseUrl + "/user/email/" + user).then(function(resp) {
    if (resp.data) {
      $scope.userData = resp.data;
      $scope.userData.mobilePhone = "(" + resp.data.mobilePhone.substring(0,3) + ")" 
        + resp.data.mobilePhone.substring(3,6) + "-" +resp.data.mobilePhone.substring(6,10);
        $scope.userData.workPhone = "(" + resp.data.workPhone.substring(0,3) + ")" 
        + resp.data.workPhone.substring(3,6) + "-" +resp.data.workPhone.substring(6,10);
      console.log($scope.userData);

      // get address information for this user
      $http.get(baseUrl + "/address/" + $scope.userData.AddrID).then(function(resp) {
        if (resp.data) {
          $scope.address = resp.data;
          console.log($scope.address);
        }
      }, function(err) {

        // API request error
        console.error('ERR', err);
        console.error('ERR', err.status);
      });
    }
  }, function(err) {

    // API request error
    console.error('ERR', err);
    console.error('ERR', err.status);
  });

  $scope.edit = function($event) {
    $scope.isEditMode = !$scope.isEditMode;
  }
})

.controller('CarpoolCtrl', function($scope) {
  console.log('CarpoolCtrl');
});

