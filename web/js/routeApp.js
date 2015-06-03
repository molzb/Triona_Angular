angular.module('trionaFilter', []).filter('hhmm', function () {
	return function (mins) {
		if (mins === 0)
            return "";
		var minAbs = Math.abs(mins);
        var minutesStr = minAbs % 60 < 10 ? "0" + minAbs % 60 : minAbs % 60;
        return (mins < 0 ? "-" : "") + parseInt(minAbs / 60) + ":" + minutesStr;
	};
});

var routeApp = angular.module('routeApp', ['ngRoute', 'trionaFilter']);
routeApp.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
				when('/home',		{templateUrl: 'home.html'}).
				when('/team',		{templateUrl: 'team.html'}).
				when('/projects',	{templateUrl: 'projects.html'}).
				when('/holidays',	{templateUrl: 'holidays.html'}).
				when('/employee',	{templateUrl: 'detailEmployee.html'}).
				when('/addEmployee',{templateUrl: 'addEmployee.html'}).
				when('/detailEmployee/:id', {templateUrl: 'detailEmployee.html'}).
				when('/editEmployee/:id',	{templateUrl: 'addEmployee.html'}).
				when('/timesheets',			{templateUrl: 'timesheets.html'}).
				when('/editTimesheet/:id',	{templateUrl: 'addTimesheet.html'}).
				when('/fixedDates',			{templateUrl: 'fixedDates.html'}).
				when('/editFixedDate/:id',	{templateUrl: 'addFixedDate.html'}).
				when('/logout',				{templateUrl: 'logout.jsp'}).
				otherwise({redirectTo: '/home'});
	}
]);
routeApp.controller('RouteCtrl', function ($scope, $location) {
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

String.prototype.format = function () {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] !== 'undefined' ? args[number] : match;
	});
};