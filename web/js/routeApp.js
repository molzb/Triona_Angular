var routeApp = angular.module('routeApp', ['ngRoute']);
routeApp.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
				when('/home', {templateUrl: 'home.html'}).
				when('/team', {templateUrl: 'teamPlain.html'}).
				when('/projects', {templateUrl: 'projects.html'}).
				when('/holidays', {templateUrl: 'holidays.html'}).
				otherwise({redirectTo: '/home'});
	}]);
routeApp.controller('RouteController', function ($scope, $location) {
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};

	$scope.classActive = function (viewLocation) {
		return $scope.isActive(viewLocation) ? "active" : "";
	}
});
