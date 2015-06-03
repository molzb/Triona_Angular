"use strict";
var myFixedDateScope;
routeApp.controller('FixedDateCtrl', function ($scope, MyService) {
	myFixedDateScope = $scope;
	$scope.employees  = [];
	$scope.fixedDates = [];
	$scope.fixedDate  = {};
	$scope.me = {};

	MyService.loadEmployees().then(function (d) {
		$scope.employees = MyService.getEmployees();
		$scope.me = MyService.getMe();

		MyService.loadFixedDates().then(function(d) {
			$scope.fixedDates = MyService.getFixedDates();
			$scope.fixedDate = $scope.fixedDates[0];	//TODO
		});
	});
});