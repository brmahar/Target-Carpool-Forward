// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCrtl'
  })
  .state('tabs', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })
  .state('tabs.profile', {
    url: "/profile",
    views: {
      'profile-tab': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('tabs.carpool', {
    url: "/carpool",
    views: {
      'carpool-tab': {
        templateUrl: "templates/carpool.html",
        controller: 'CarpoolCtrl'
      }
    }
  })
  .state('tabs.search', {
    url: "/search",
    views: {
      'carpool-tab': {
        templateUrl: "templates/search.html",
        controller: 'SearchCtrl'
      }
    }
  })
  .state('tabs.search-results', {
    url: "/search-results",
    views: {
      'carpool-tab': {
        templateUrl: "templates/search-results.html",
        controller: 'SearchResultsCtrl'
      }
    }
  })
  .state('tabs.carpool-details', {
    url: "/carpool-details",
    views: {
      'carpool-tab': {
        templateUrl: "templates/carpool-details.html",
        controller: 'CarpoolDetailsCtrl'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
