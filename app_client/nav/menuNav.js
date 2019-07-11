var app = angular.module('menuApp');

app.directive('nav', function() {
	return {
		restrict: 'EA',
		templateUrl: '/nav/menunav.html',
		controller: 'MenuNavController',
		controllerAs: 'vm'
	};
});

app.controller('MenuNavController', ['$location', 'authentication', function MenuNavController($location, authentication) {
	var vm = this;
	vm.currentPath = location.path();
	vm.currentUser = function() { 
	return authentication.currentUser();
	}
	vm.isLoggedIn = function() {
		return authentication.isLoggedIn();
	}
	vm.logout = function() {
		authentication.logout();
		$location.path('/').replace();
	};
}]);