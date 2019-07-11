var app = angular.module('menuApp', ['ngRoute']);

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
    .when('/', {
      templateUrl: 'pages/lyndon.html',
      controller: 'homeCtrl',
      controllerAs: 'vm'
    })
    .when('/menu', {
      templateUrl : 'pages/menulist.html',
      controller: 'listCtrl',
      controllerAs: 'vm'
    })
    .when('/menuadd', {
      templateUrl: 'pages/menuadd.html',
      controller: 'addCtrl', 
      controllerAs: 'vm'
    })
    .when('/menuedit/:id', {
      templateUrl: 'pages/menuedit.html',
      controller: 'editCtrl',
      controllerAs: 'vm'
    })
    .when('/menudelete/:id', {
      templateUrl: 'pages/menudelete.html',
      controller: 'deleteCtrl', 
      controllerAs: 'vm'
    })
    .otherwise({redirectTo: '/'});
});   