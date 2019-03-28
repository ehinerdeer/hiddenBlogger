/* Start of blogApp */
var app = angular.module('blogApp', ['ngRoute']);

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
			templateUrl: 'pages/home.html',
			controller: 'homeCtrl',
			controllerAs: 'vm'
		})
		.when('/bloglist', {
			templateUrl: 'pages/bloglist.html',
			controller: 'listCtrl',
			controllerAs: 'vm'
		})
		.when('/blogadd', {
			templateUrl: 'pages/blogadd.html',
			controller: 'addCtrl',
			controllerAs: 'vm'
		})
		.when('/blogedit/:blogid', {
			templateUrl: 'pages/blogedit.html',
			controller: 'editCtrl',
			controllerAs: 'vm'
		})
		.when('/blogdelete/:blogid', {
			templateUrl: 'pages/blogdelete.html',
			controller: 'deleteCtrl',
			controllerAs: 'vm'
		})
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
		.otherwise({redirectTo: '/'});
});

/* Blog Controllers */
app.controller('homeCtrl', function homeCtrl() {
	var vm = this;
	vm.title = "Eric Hinerdeer Blog Site";
	vm.message = "Welcome to my Blog Site";
});

app.controller('listCtrl', function listCtrl($http) {
	var vm = this;
	vm.title = "Eric Hinerdeer Blog Site";
        vm.message = "Blog List";

        getAllBlogs($http)
        .success(function(data) {
	    vm.blogs = data;
	    vm.message = "Found Blogs!";
	})
        .error(function(e) {
	    vm.message = "Could not get Blog List";
	});
});

app.controller('addCtrl',[ '$http', '$location', function addCtrl($http, $location) {
    var vm = this;
    vm.blog = {};
    vm.title = "Eric Hinerdeer Blog Site";
    vm.message = "Add A Blog";

    vm.onSubmit = function() {

	var data = vm.blog;
	
	data.blogTitle = userForm.blogTitle.value;
	data.blogText = userForm.blogText.value;
	
	addOneBlog($http, data)
		.success(function(data) {
		    console.log(data);
		    $location.path('/bloglist').replace();
		})
		.error(function(e) {
		    console.log(e);
		});
        };
}]);

app.controller('editCtrl', [ '$http', '$routeParams', '$location', function editCtrl($http, $routeParams, $location) {
    var vm = this;
    vm.title = "Eric Hinerdeer Blog Site";
    vm.message = "Edit Your Blog";
    vm.blog = {};
    vm.id = $routeParams.blogid;

    readOneBlog($http, vm.id)
    	.success(function(data) {
    		vm.blog = data;
    })
    .error(function(e) {
    	vm.message = "Could not get blog with id: " + vm.id;
    })

    vm.onSubmit = function() {
    	var data = {};
    	data.blogTitle = userForm.blogTitle.value;
    	data.blogText = userForm.blogText.value;

    	updateOneBlog($http, data, vm.id)
    		.success(function(data) {
    		    vm.message = "Blog Updated!";
    		    $location.path('/bloglist').replace();
    		})
    		.error(function(e) {
    			vm.message = "Could not update blog with id: " + vm.id;
    		});
    }
    
}]);

app.controller('deleteCtrl', [ '$http', '$routeParams', '$location', function deleteCtrl($http, $routeParams, $location) {
    var vm = this;
    vm.title = "Eric Hinerdeer Blog Site";
    vm.message = "Delete Your Blog";
    vm.blog = {};
    vm.id = $routeParams.blogid;
    readOneBlog($http, vm.id)
    	.success(function(data) {
    		vm.blog = data;
    		vm.message = "Are you sure you wish to delete this blog?"
    })
    .error(function(e) {
    	vm.message = "Could not get blog with id: " + vm.id;
    })

    vm.onSubmit = function() {
    	var data = vm.blog;

    	deleteOneBlog($http, vm.id)
    		.success(function(data) {
    		    vm.message = "Blog Deleted Successfully!";
    		    $location.path('/bloglist').replace();
    		})
    		.error(function(e) {
    			vm.message = "Could not update blog with id: " + vm.id;
    		});
    }

}]);

 /* Register and Login Controllers */
 app.controller('LoginController', [ '$http', '$location', 'authentication', function LoginController($htttp, $location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Sign in to Blogger'
    };

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.returnPage = $location.search().page || '/';

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

app.controller('RegisterController', [ '$http', '$location', 'authentication', function RegisterController($htttp, $location, authentication) {
    var vm = this;
    
    vm.pageHeader = {
      title: 'Create a new Blooger account'
    };
    
    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };
    
    vm.returnPage = $location.search().page || '/';
    
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
          vm.formError = "Error registering. Try again with a different email address."
          //vm.formError = err;
        })
        .then(function(){
          $location.search('page', null); 
          $location.path(vm.returnPage);
        });
    };
}]);

/* REST API Functions */
function getAllBlogs($http) {
    return $http.get('/api/blog');
}

function readOneBlog($http, blogid) {
    return $http.get('/api/blog/' + blogid);
}

function updateOneBlog($http, data, blogid) {
    return $http.put('/api/blog/' + blogid , data);
}

function addOneBlog($http, data) {
    return $http.post('/api/blog', data);
}

function deleteOneBlog($http, blogid) {
    return $http.delete('/api/blog/' + blogid);
}
