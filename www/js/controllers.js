angular.module('starter.controllers', [])

.controller('BuildsCtrl', function($scope, $stateParams, $ionicPopup, $state, $cordovaSQLite, $rootScope) {

  if(((!document.getElementsByTagName('ion-item')[2]) && !(document.getElementsByTagName('p')[0])) || (typeof $rootScope.builds == 'undefined')) {
    var x = document.getElementById('builds');
    var text = document.createTextNode('No Builds Currently');
    var p = document.createElement('p');
    p.setAttribute('id', 'pow');
    p.setAttribute('style', 'text-align: center');
    p.append(text);
    x.append(p);
    $rootScope.components = [];
    $rootScope.scanned = [];
    $rootScope.builds = [];
    $rootScope.total = 0;
  }

  $rootScope.addBuild = function() {
    $rootScope.builds.push({title: $rootScope.data.name, desc: $rootScope.data.desc});
    $state.go('app.builds');
    if(document.getElementById('pow')) {
      document.getElementById('pow').remove();
    }
  };

  $scope.showData = function(table, desc) {
    if(!($rootScope.scanned.includes(table))) {
      $rootScope.description = desc;
      $rootScope.scanned.push(table);
      var query = "SELECT * FROM " + table;
      $cordovaSQLite.execute($scope.db,query,[]).then(function(result) {
        if(result.rows.length > 0) {
          for(i = 0; i<result.rows.length; i++) {
              $rootScope.components.push(
                {title: result.rows.item(i).name, price: result.rows.item(i).price}
              );
              $rootScope.total += result.rows.item(i).price;
            console.log("Price: " + result.rows.item(i).price);
          }
        }
        else {
          console.log("NO ROWS EXIST");
        }
      }, function(error) {
        console.error(error);
      });
    }
  };

  $scope.goToBuildCreate = function() {
    $state.go('app.build-create');
  };

  $scope.refresh = function() {
    $state.go($state.current, {}, {reload: true});
  };

  $scope.whichBuild = $stateParams.buildTitle;

  $scope.showPopup = function() {
    $rootScope.data = {};
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: 'Enter Build Name<input type="name" ng-model="data.name">Enter Build Description<textarea rows="3" cols="5" ng-model="data.desc">',
      title: 'Create A New Build',
      scope: $rootScope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$rootScope.data.name) {
              //don't allow the user to close unless he enters name
              e.preventDefault();
            } else {
              $state.go('app.build-create');
              $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS " + $rootScope.data.name + " (name text, price real)");
              return $rootScope.data.name + $rootScope.data.desc;
            }
          }
        },
      ]
    });
    myPopup.then(function(res) {
      console.log(res);
    });
  };
})

.controller('BuildCreateCtrl', function($scope, $rootScope, $ionicPopover, $state, $stateParams, $http, $cordovaSQLite) {

  $scope.chooseCpu = function(cpu) {
    if(cpu == 1) {
      $scope.sockets = [
        { title: 'LGA 1151', id: 0 },
        { title: 'LGA 1150', id: 1 },
        { title: 'LGA 2011', id: 2 }
      ];
    }
    else {
      $scope.sockets = [
        { title: 'AM3+', id: 0 },
        { title: 'AM4', id: 1 }
      ];
    }
  };

  $http.get('js/parts.json').success(function(data) {
    $scope.socketSelect = function(sock) {
      $rootScope.mems = data.memory;
      $rootScope.cards = data.video;
      $rootScope.cases = data.cases;
      $rootScope.psus = data.psu;
      $scope.popover.hide();
      if(sock.title == data.intelCpu[0].title) {
        $rootScope.cpus = data.intelCpu[0].lga1150;
        $rootScope.mobos = data.mobo[0].lga1150;
        $rootScope.coolers = data.cpuCooler[0].lga1150;
      }
      else if(sock.title == data.intelCpu[1].title) {
        $rootScope.cpus = data.intelCpu[1].lga1151;
        $rootScope.mobos = data.mobo[0].lga1151;
        $rootScope.coolers = data.cpuCooler[0].lga1151;
      }
      else if(sock.title == data.intelCpu[2].title) {
        $rootScope.cpus = data.intelCpu[2].lga2011;
        $rootScope.mobos = data.mobo[0].lga2011;
        $rootScope.coolers = data.cpuCooler[0].lga2011;
      }
      else if(sock.title == data.amdCpu[0].title) {
        $rootScope.cpus = data.amdCpu[0].am3;
        $rootScope.mobos = data.mobo[0].am3;
        $rootScope.coolers = data.cpuCooler[0].am3;
      }
      else if(sock.title == data.amdCpu[1].title) {
        $rootScope.cpus = data.amdCpu[1].am4;
        $rootScope.mobos = data.mobo[0].am4;
        $rootScope.coolers = data.cpuCooler[0].am4;
      }
    };
  });

  $scope.parts = [
    { title: 'CPU', id: 0 },
    { title: 'CPU Cooler', id: 1 },
    { title: 'Motherboard', id: 2 },
    { title: 'Memory', id: 3 },
    { title: 'Video Card', id: 4 },
    { title: 'Case', id: 5 },
    { title: 'PSU', id: 6 }
  ];

  $scope.whichPart = $stateParams.partId;

  $ionicPopover.fromTemplateUrl('build-create.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });

  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });

  $scope.updatePart = function(id, name) {
    var title = document.getElementById('p'+id);
    title.removeAttribute("href");
    title.innerHTML = name;
    $state.go('app.build-create');
  };

  $scope.removePart = function(name, id) {
    var title = document.getElementById('p'+id);
    var item = title.innerHTML;
    title.innerHTML = "Add " + name;
    title.setAttribute("href", "#/app/build-create/"+id);
    var query = "DELETE FROM " + $rootScope.data.name + " WHERE name = ?";
    $cordovaSQLite.execute($scope.db,query,[item]).then(function(result) {
      console.log("DELETE ITEM -> " + item);
    },
    function(error) {
      console.error(error);
    });
  };

  $scope.addPart = function(name, cost) {
    var price = parseFloat(cost);
    var query = "INSERT INTO " + $rootScope.data.name + " (name, price) VALUES (?,?)";
    $cordovaSQLite.execute($scope.db,query,[name,price]).then(function(result) {
      console.log("INSERT NAME -> " + name);
    },
    function(error) {
      console.error(error);
    });
  };
});
