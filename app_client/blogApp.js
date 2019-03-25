/* Start of bloggerApp */
var app = angular.module('blogApp', []);

/* Route Provider */
app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'pages/index.html',
			controller: 'homeCtrl',
			controllerAs: 'vm'
		})
		.when('/bloglist', {
			templateUrl: 'pages/bloglist.html',
			controller: 'listCtrl',
			controllerAs: 'vm'
		})
		.when('/blogadd', {
			templareUrl: 'pages/blogadd.html',
			controller: 'addCtrl',
			controllerAs: 'vm'
		})
		.when('/blogedit', {
			templareUrl: 'pages/blogedit.html',
			controller: 'editCtrl',
			controllerAs: 'vm'
		})
		.when('/blogdelete', {
			templareUrl: 'pages/blogdelete.html',
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
}) ;

app.controller('listCtrl', function listCtrl() {
	var vm = this;
	vm.title = "Eric Hinerdeer Blog Site";
    vm.message = "Blog List";
});

app.controller('addCtrl', function addCtrl() {
	var vm = this;
	vm.title = "Eric Hinerdeer Blog Site";
	vm.message = "Add A Blog";
});

app.controller('editCtrl', function editCtrl() {
	var vm = this;
	vm.title = "Eric Hinerdeer Blog Site";
	vm.message = "Edit Your Blog";
});

app.controller('deleteCtrl', function deleteCtrl() {
	var vm = this;
	vm.title = "Eric Hinerdeer Blog Site";
	vm.message = "Delete Your Blog";
})

