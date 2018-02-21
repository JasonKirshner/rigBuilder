// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard && window.cordova.plugins) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    // This will create an empty database when the app runs the first time
    // and create the table 'tasks'.
    // for a browser:
    $rootScope.db = window.openDatabase("buildsList.db", '1.0', 'App Demo', 65536);
    // for the device:
    //$rootScope.db = $cordovaSQLite.openDB({name: "buildsList.db"});
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

    .state('app.builds', {
      url: '/builds',
      views: {
        'menuContent': {
          templateUrl: 'templates/builds.html',
          controller: 'BuildsCtrl'
        }
      }
    })

  .state('app.build', {
    url: '/builds/:buildTitle',
    views: {
      'menuContent': {
        templateUrl: 'templates/build.html',
        controller: 'BuildsCtrl'
      }
    }
  })

  .state('app.build-create', {
    url: '/builds/build-create',
    views: {
      'menuContent': {
        templateUrl: 'templates/build-create.html',
        controller: 'BuildCreateCtrl'
      }
    }
  })

  .state('app.cpus', {
    url: '/build-create/0',
    views: {
      'menuContent': {
        templateUrl: 'templates/parts-cpus.html',
        controller: 'BuildCreateCtrl'
      }
    }
  })

  .state('app.coolers', {
    url: '/build-create/1',
    views: {
      'menuContent': {
        templateUrl: 'templates/parts-coolers.html',
        controller: 'BuildCreateCtrl'
      }
    }
  })

  .state('app.mobos', {
    url: '/build-create/2',
    views: {
      'menuContent': {
        templateUrl: 'templates/parts-mobos.html',
        controller: 'BuildCreateCtrl'
      }
    }
  })

  .state('app.mem', {
    url: '/build-create/3',
    views: {
      'menuContent': {
        templateUrl: 'templates/parts-mem.html',
        controller: 'BuildCreateCtrl'
      }
    }
  })

  .state('app.video', {
    url: '/build-create/4',
    views: {
      'menuContent': {
        templateUrl: 'templates/parts-video.html',
        controller: 'BuildCreateCtrl'
      }
    }
  })

  .state('app.cases', {
    url: '/build-create/5',
    views: {
      'menuContent': {
        templateUrl: 'templates/parts-cases.html',
        controller: 'BuildCreateCtrl'
      }
    }
  })

  .state('app.psus', {
    url: '/build-create/6',
    views: {
      'menuContent': {
        templateUrl: 'templates/parts-psus.html',
        controller: 'BuildCreateCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/builds');
});
