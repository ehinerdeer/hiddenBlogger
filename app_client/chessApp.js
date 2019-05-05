/* Start of chessApp */
var app = angular.module('chessApp', ['ngRoute']);
//*** Authentication Service and Methods **
app.service('authentication', authentication);
    authentication.$inject = ['$window', '$http'];
    function authentication ($window, $http) {
    
        var saveToken = function (token) {
            $window.localStorage['blog-token'] = token;
        };
                                       
        var getToken = function () {
            return $window.localStorage['blog-token'];
        };
        
        var register = function(user) {
            console.log('Registering user ' + user.email + ' ' + user.password);
            return $http.post('/api/register', user).success(function(data){
                saveToken(data.token);
          });
        };
     
        var login = function(user) {
           console.log('Attempting to login user ' + user.email + ' ' + user.password);
            return $http.post('/api/login', user).success(function(data) {
              saveToken(data.token);
           });
        };
        
        var logout = function() {
            $window.localStorage.removeItem('blog-token');
        };
        
        var isLoggedIn = function() {
          var token = getToken();

          if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
          } else {
            return false;
          }
        };

        var currentUser = function() {
          if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));  
	      return {
              email : payload.email,
              name : payload.name
            };
          }
        };

        return {
          saveToken : saveToken,
          getToken : getToken,
          register : register,
          login : login,
          logout : logout,
          isLoggedIn : isLoggedIn,
          currentUser : currentUser
        };
}

/* Route Provider */
app.config(function($routeProvider) {
	$routeProvider
    	.when('/login' , {
      		templateUrl: 'pages/login.html',
		    controller: 'LoginController',
		    controllerAs: 'vm'
		})
    	.when ('/register' , {
		    templateUrl: 'pages/register.html',
		    controller: 'RegisterController',
		    controllerAs: 'vm'
		})
        .when('/' , {
			templateUrl: 'pages/chess.html',
			controller: 'ChessCtrl',
			controllerAs: 'vm'
        })
		.otherwise({redirectTo: '/'});
});

/* CHESS GAME CONTROLLER */
app.controller('ChessCtrl' , ['$http', '$scope', '$interval', function ChessCtrl($http, $scope, $interval) {
  var vm = this;
  vm.title = "Tic Tac Toe";
  vm.message = "Don't Lose The Queen!";
  vm.pieces = {};
  
  vm.A1 = {name: "", piece: ""};
  vm.A2 = {name: "", piece: ""};
  vm.A3 = {name: "", piece: ""};
  vm.B1 = {name: "", piece: ""};
  vm.B2 = {name: "", piece: ""};
  vm.B3 = {name: "", piece: ""};
  vm.C1 = {name: "", piece: ""};
  vm.C2 = {name: "", piece: ""};
  vm.C3 = {name: "", piece: ""};

  $scope.newGame = function() {
    getAllPieces($http).success(function(data) {
      vm.pieces = data;
    }).error(function(e) {
      vm.message = "Could not get list";
    });

    if(vm.pieces) {
      vm.A1.piece = "";
      vm.A2.piece = "";
      vm.A3.piece = "";
      vm.B1.piece = "";
      vm.B2.piece = "";
      vm.B3.piece = "";
      vm.C1.piece = "";
      vm.C2.piece = "";
      vm.C3.piece = "";
      vm.A1.name = "A1";
      vm.A2.name = "A2";
      vm.A3.name = "A3";
      vm.B1.name = "B1";
      vm.B2.name = "B2";
      vm.B3.name = "B3";
      vm.C1.name = "C1";
      vm.C2.name = "C2";
      vm.C3.name = "C3";
      addOnePiece($http, vm.A1).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
      addOnePiece($http, vm.A2).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
      addOnePiece($http, vm.A3).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
      addOnePiece($http, vm.B1).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
      addOnePiece($http, vm.B2).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
      addOnePiece($http, vm.B3).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
      addOnePiece($http, vm.C1).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
      addOnePiece($http, vm.C2).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
      addOnePiece($http, vm.C3).success(function(data) {
        console.log(data);
      }).error(function(e) {
        console.log(e);
      });
    }
  }

}]);


/* REST API Functions */
function getAllPieces($http) {
    return $http.get('/api/chess');
}

function readOnePiece($http, pieceid) {
    return $http.get('/api/chess/' + pieceid);
}

function updateOnePiece($http, data, pieceid) {
    return $http.put('/api/chess/' + pieceid , data);
}

function addOnePiece($http, data) {
    return $http.post('/api/chess', data);
}

function deleteOnePiece($http, pieceid) {
    return $http.delete('/api/chess/' + pieceid);
}


 /* Register and Login Controllers */
 app.controller('LoginController', [ '$http', '$location', 'authentication', function LoginController($htttp, $location, authentication) {
    var vm = this;

    vm.title = "Welcome!";
     vm.message = "Sign in to Eric's Blog";

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.returnPage = $location.search().page || '/bloglist';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.email || !vm.credentials.password) {
           vm.formError = "All fields required, please try again";
        return false;
      } else {
           vm.doLogin();
      }
    };

    vm.doLogin = function() {
      vm.formError = "";
      authentication
        .login(vm.credentials)
        .error(function(err){
          var obj = err;
          vm.formError = obj.message;
        })
        .then(function(){
          $location.search('page', null); 
          $location.path(vm.returnPage);
        });
    };
 }]);

app.controller('RegisterController', [ '$http', '$location', 'authentication', function RegisterController($http, $location, authentication) {
    var vm = this;
    
    vm.title = "Registration";
    vm.message = "Create a New Account";
    
    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };
    
    vm.returnPage = $location.search().page || '/bloglist';
    
    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doRegister();
      }
    };

    vm.doRegister = function() {
      vm.formError = "";
      authentication
        .register(vm.credentials)
        .error(function(err){
          vm.formError = "Error registering. Try again with a different email address.";
        })
        .then(function(){
          $location.search('page', null); 
          $location.path(vm.returnPage);
        });
    };
}]);
