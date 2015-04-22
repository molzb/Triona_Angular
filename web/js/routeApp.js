var routeApp = angular.module('routeApp', ['ngRoute']);
routeApp.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
				when('/home',		{templateUrl: 'home.html'}).
				when('/team',		{templateUrl: 'teamPlain.html'}).
				when('/projects',	{templateUrl: 'projects.html'}).
				when('/holidays',	{templateUrl: 'holidaysPlain.html'}).
				when('/employee',	{templateUrl: 'detailEmployee.html'}).
				when('/addEmployee',{templateUrl: 'addEmployee.html'}).
				when('/logout',		{templateUrl: 'logout.jsp'}).
				otherwise({redirectTo: '/home'});
	}]);
routeApp.controller('RouteController', function ($scope, $location) {
	$scope.isActive = function (viewLocation) {
		return viewLocation === $location.path();
	};

	$scope.classActive = function (viewLocation) {
		return $scope.isActive(viewLocation) ? "active" : "";
	};
});

function redirectToLogin() {
	window.setTimeout(function() {
		window.location.href = "login.jsp";
	}, 2000);
}