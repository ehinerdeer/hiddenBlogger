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
app.controller('ChessCtrl' , ['$http', '$scope', '$routeParams', function ChessCtrl($http, $scope, $routeParams) {
  var vm = this;
  vm.title = "Chess";
  vm.message = "Don't Lose The Queen!";
  vm.turn = {};
  vm.turn.name = "white";

  vm.add = function() {
    addOnePiece($http, vm.turn)
      .success(function(data) {
        vm.message = "Added to DB";
      }).error(function(e) {
        vm.message = "Didn't Add =(";
      });
  }

  vm.changeColor = function() {
    getAllPieces($http).success(function(data) {
      vm.turn = data[0];
    }).error(function(e) {
      vm.message = "Error getting Color";
    });

    if(vm.turn.length > 0) {
      if(vm.turn.name === "white") {
        vm.turn.name = "grey";
      updateOnePiece($http, vm.turn, pieceid)
        .success(function(data) {
          vm.message = "Changed to Grey";
        }).error(function(e) {
          vm.message = "Error Changing Color";
        });
    } else if(vm.turn.name === "grey") {
       if(vm.turn.name === "grey") {
        vm.turn.name = "white";
      updateOnePiece($http, vm.turn, pieceid)
        .success(function(data) {
          vm.message = "Changed to White";
        }).error(function(e) {
          vm.message = "Error Changing Color";
        });
    }
    }
  }
  $scope.test = [ "&#9812;" , "" ];

 /* vm.Click = function(spaceId) {
	  var elem = document.getElementById(spaceId);
	  if(elem.innerHTML=="X" && vm.clicks==0) {
		  vm.premove = elem.innerHTML;
		  vm.clicks++;
		  vm.premoveNum = spaceId;
	  }
	  if(elem.innerHTML=="" && vm.clicks==1) {
		  elem.innerHTML==vm.premove;
		  vm.clicks--;
		  vm.premoveNum.innerHTML = "";
	  }
  } */
  
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
