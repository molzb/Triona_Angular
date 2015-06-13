"use strict";
var myFixedDateScope;
routeApp.controller('FixedDateCtrl', function ($scope, $route, $http, MyService) {
	myFixedDateScope = $scope;
	$scope.employees  = [];
	$scope.fixedDates = [];
	$scope.fixedDate  = {};
	$scope.fixedDatesEmployees = [];
	$scope.agreed1 = []; $scope.agreed2 = []; $scope.agreed3 = [];
	$scope.agreed4 = []; $scope.agreed5 = []; $scope.agreed6 = [];
	$scope.me = {};

	MyService.loadEmployees().then(function () {
		$scope.employees = MyService.getEmployees();
		$scope.me = MyService.getMe();

		MyService.loadFixedDates().then(function() {
			$scope.fixedDates = MyService.getFixedDates();
			$scope.fixedDate = $scope.fixedDates[0];	//TODO

			MyService.loadFixedDatesEmployees($scope.fixedDate.id).then(function() {
				$scope.fixedDatesEmployees = MyService.getFixedDatesEmployees();
				for (var i = 0; i < $scope.fixedDatesEmployees.length; i++) {
					var fde = $scope.fixedDatesEmployees[i];
					for (var j = 0; j < $scope.employees.length; j++) {
						var emp = $scope.employees[j];
						if (fde.employeeId === emp.id) {
							emp.agreed = fde.agreed;
						}
					}
				}
			});
		});
	});

	$scope.isChecked = function(employeeId, dateIdx) {
		for (var i = 0; i < $scope.fixedDatesEmployees.length; i++) {
			var emp = $scope.fixedDatesEmployees[i];
			if (emp.employeeId === employeeId) {
				return emp.agreed[dateIdx-1] === true;
			}
		}
		return false;
	};

	$scope.isCheckedCssTr = function(emp, idx) {
		if (emp.id === $scope.me.id)
			return '';
		if (!emp.agreed || emp.agreed[idx] === null)
			return 'grey';
		return emp.agreed[idx] === true ? 'alert-success' : 'alert-danger';
	};

	$scope.isCheckedCssIcon = function(emp, idx) {
		if (!emp.agreed)
			return '';
		if (!emp.agreed || emp.agreed[idx] === null)
			return '';
		return emp.agreed[idx] === true ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove';
	};

	$scope.title = function(employeeId, dateIdx) {
		return this.isChecked(employeeId, dateIdx) ? "Yes, I can" : "No, I can't";
	};

	$scope.save = function() {
		var q = $('form').serialize().split('&');
		var myData = 'type=fixeddates_employees&sqltype=UPDATE&id={0}&employeeId={1}&agreed1={2}&agreed2={3}&agreed3={4}&agreed4={5}&agreed5={6}&agreed6={7}'.format(
				$scope.fixedDate.id, $scope.me.id, this.getVal(q[0]), this.getVal(q[1]), this.getVal(q[2]),
				this.getVal(q[3]), this.getVal(q[4]), this.getVal(q[5]));
		console.log(myData);
		$http.post('PutServlet?' + myData).success(function() {
			$route.reload();
		}).error(function(error) {
			console.log("Error when saving fixed dates: " + error);
		});
	};

	/**
	 * Return value of a key-value pair
	 * @param {String} keyValue, e.g. hello=world
	 * @returns {String} value of that key-value pair
	 */
	$scope.getVal = function(keyValue) {
		if (!keyValue || keyValue.indexOf("=") === -1)
			return null;
		return keyValue.split("=")[1] === "on";
	};
});