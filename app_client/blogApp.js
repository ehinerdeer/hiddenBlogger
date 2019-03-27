/* Start of blogApp */
var app = angular.module('blogApp', ['ngRoute']);

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
		.otherwise({redirectTo: '/'});
});

/* Controllers */
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

app.controller('addCtrl', function addCtrl($http) {
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
		})
		.error(function(e) {
		    console.log(e);
		});
        };
});

app.controller('editCtrl', [ '$http', '$routeParams', function editCtrl($http, $routeParams) {
    var vm = this;
    vm.title = "Eric Hinerdeer Blog Site";
    vm.message = "Edit Your Blog";
    vm.blog = {};
    vm.id = $routeParams.blogid;

    readOneBlog($http, vm.id)
    	.success(function(data) {
    		vm.blog = data;
    		vm.message = "Blog Found!"
    })
    .error(function(e) {
    	vm.message = "Could not get blog with id: " + vm.id;
    })

    vm.onSubmit = function() {
    	var data = vm.blog;
    	data.blogTitle = userForm.blogTitle.value;
    	data.blogText = userForm.blogTitle.value;

    	updateOneBlog($http, vm.id, data)
    		.success(function(data) {
    			vm.message = "Blog Updated!";
    			//$state.go('bloglist');
    		})
    		.error(function(e) {
    			vm.message = "Could not update blog with id: " + vm.id;
    		});
    }
    
}]);

app.controller('deleteCtrl', [ '$http', '$routeParams', '$state', function deleteCtrl($http, $routeParams, $state) {
	var vm = this;
	vm.title = "Eric Hinerdeer Blog Site";
	vm.message = "Delete Your Blog";
    vm.blog = {};
    vm.id = $routeParams.blogid;
    readOneBlog($http, vm.id)
    	.success(function(data) {
    		vm.blog = data;
    		vm.message = "Blog Found!"
    })
    .error(function(e) {
    	vm.message = "Could not get blog with id: " + vm.id;
    })

    vm.onSubmit = function() {
    	var data = vm.blog;
    	data.blogTitle = userForm.blogTitle.value;
    	data.blogText = userForm.blogTitle.value;

    	deleteOneBlog($http, vm.id)
    		.success(function(data) {
    			vm.message = "Blog Updated!";
    			$state.go('bloglist');
    		})
    		.error(function(e) {
    			vm.message = "Could not update blog with id: " + vm.id;
    		});
    }

}]);

/* REST Functions */
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
