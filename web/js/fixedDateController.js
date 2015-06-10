"use strict";
var myFixedDateScope;
routeApp.controller('FixedDateCtrl', function ($scope, MyService) {
	myFixedDateScope = $scope;
	$scope.employees  = [];
	$scope.fixedDates = [];
	$scope.fixedDate  = {};
	$scope.fixedDatesEmployees = [];
	$scope.me = {};

	MyService.loadEmployees().then(function () {
		$scope.employees = MyService.getEmployees();
		$scope.me = MyService.getMe();

		MyService.loadFixedDates().then(function() {
			$scope.fixedDates = MyService.getFixedDates();
			$scope.fixedDate = $scope.fixedDates[0];	//TODO

			MyService.loadFixedDatesEmployees($scope.fixedDate.id).then(function() {
				$scope.fixedDatesEmployees = MyService.getFixedDatesEmployees();
			});
		});
	});

	$scope.isChecked = function(employeeId, dateIdx) {
		for (var i = 0; i < $scope.fixedDatesEmployees.length; i++) {
			var emp = $scope.fixedDatesEmployees[i];
			if (emp.employeeId === employeeId) {
				return emp.agreed[dateIdx-1] === "true";
			}
		}
		return false;
	};

	$scope.isCheckedCssTr = function(employeeId, dateIdx) {
		if (employeeId === $scope.me.id)
			return "";
		return this.isChecked(employeeId, dateIdx) ? "alert-success" : "alert-danger";
	};

	$scope.isCheckedCssIcon = function(employeeId, dateIdx) {
		return this.isChecked(employeeId, dateIdx) ? "glyphicon glyphicon-ok" : "glyphicon glyphicon-remove";
	};

});