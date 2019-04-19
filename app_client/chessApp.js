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
app.controller('ChessCtrl' , ['$http', function ChessCtrl($http) {
  var vm = this;
  vm.title = "Chess";
  vm.message = "Don't Lose The Queen!";
  vm.allPieces = {};
  vm.newGameData = {};
  
  vm.newGame = function() {
  
  //check if DB is empty (should probably only be empty on first ever game)
  getAllPieces($http)
  .success(function(data) {
	  vm.allPieces = data;
  })
  .error(function(e) {
	  vm.message = "Error Finding Pieces";
  });
  
  /* If Pieces in data base erase database to begin new game */
  if(vm.allPieces) {
  angular.forEach(vm.allPieces, function(piece) {
	deleteOnePiece($http, piece.pieceid);
  })
  }
  
  /* Array to help create new pieces */
  vm.whitePieces = ["p","p","p","p","p","p","p","p","r","n","b","q","k","b","n","r"];
  vm.blackPieces = ["p","p","p","p","p","p","p","p","r","n","b","k","q","b","n","r"];
  
  var dataToAdd = {};
  
  /* Populate Database with New Pieces */
  for(let i = 0; i < 8; i++) {
	//adding white pawns
	dataToAdd = {};
	dataToAdd.name = vm.whitePieces[i];
	dataToAdd.color = "white";
	dataToAdd.boardPos = [ {
	    x : i,
	    y : 2
	}];
	addOnePiece($http, dataToAdd);
	dataToAdd = {};
	//adding black pawns
	dataToAdd.name = vm.blackPieces[i];
	dataToAdd.color = "black";
	dataToAdd.boardPos = [ {
	    x : i,
	    y : 7
	}];
	addOnePiece($http, dataToAdd);
	dataToAdd = {};
	//adding white pieces
	dataToAdd.name = vm.whitePieces[i + 8];
	dataToAdd.color = "white";
	dataToAdd.boardPos = [ {
	    x : i,
	    y : 1
	}];
	addOnePiece($http, dataToAdd);
	dataToAdd = {};
	//adding black pawns
	dataToAdd.name = vm.blackPieces[i + 8];
	dataToAdd.color = "black";
	dataToAdd.boardPos = [ {
	    x : i,
	    y : 8
	}];
	addOnePiece($http, dataToAdd);
	
  } // end for loop 
  
  /* After DB is populated GET data out again */
  
  getAllPieces($http)
  .success(function(data) {
	  vm.newGameData = data;
  })
  .error(function(e) {
	  vm.message = "Error Finding Pieces";
  });
  
  } //end newGame function
  
  /* Seperate arrays for setting up initial board  (to use ng-repeat easier) */
  vm.whitePawns = [{}];
  vm.blackPawns = [{}];
  vm.whiteMinors = [{}];
  vm.blackMinors = [{}];
  
  angular.forEach(vm.newGameData, function(piece) {
	  if(newGameData.name === "p" && newGameData.color === "white") {
		  vm.whitePawns.push(piece);
	  } else if(newGameData.name === "p" && newGameData.color === "black") {
		  vm.blackPawns.push(piece);
	  } else if (newGameData.name != "p" && newGameData.color === "white") {
		  vm.whiteMinors.push(piece);
	  } else if (newGameData.name != "p" && newGameData.color === "black") {
		  vm.blackMinors.push(piece);
	  }
  })
  
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
