"use strict";
var myFixedDateScope;
routeApp.controller('FixedDateCtrl', function ($scope, $route, $http, $routeParams, MyService) {
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
			var idxParam = $routeParams.idx;
			if (idxParam === undefined) {
				idxParam = '-1';
			}
			if (idxParam !== '-1' && !idxParam.match(/[0-9]{1,6}/)) {
				alert('This is not a valid ID: ' + idxParam);
				$scope.fixedDate.title = 'This is not a valid ID: ' + idxParam;
				return false;
			}
			$scope.fixedDate = $scope.findFixedDate($scope.fixedDates, parseInt(idxParam));

			MyService.loadFixedDatesEmployees($scope.fixedDate.id).then(function() {
				$scope.fixedDatesEmployees = MyService.getFixedDatesEmployees();
				insertAgreedIntoEmployeesArray();
				addMouseOverEventInOverview();
			});
		});
	});

	function insertAgreedIntoEmployeesArray() {
		for (var i = 0; i < $scope.fixedDatesEmployees.length; i++) {
			var fde = $scope.fixedDatesEmployees[i];
			for (var j = 0; j < $scope.employees.length; j++) {
				var emp = $scope.employees[j];
				if (fde.employeeId === emp.id) {
					emp.agreed = fde.agreed;
				}
			}
		}
	}

	$scope.findFixedDate = function(fixedDates, id) {
		if (id === -1)
			return fixedDates[0];
		for (var j = 0; j < fixedDates.length; j++) {
			if (fixedDates[j].id === id)
				return fixedDates[j];
		}
		return null;
	};

	$scope.isChecked = function(employeeId, dateIdx) {
		for (var i = 0; i < $scope.fixedDatesEmployees.length; i++) {
			var emp = $scope.fixedDatesEmployees[i];
			if (emp.employeeId === employeeId) {
				return emp.agreed[dateIdx-1] === true;
			}
		}
		return false;
	};

	function addMouseOverEventInOverview() {
		var pnls = $("#fixedDatesOverview .panel");
		pnls.mouseenter(function() { $(this).addClass('panel-primary').removeClass('panel-default'); })
		pnls.mouseleave(function() { $(this).removeClass('panel-primary').addClass('panel-default'); })
	}

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

	$scope.cannotMakeIt = function() {
		for (var i = 0; i < this.me.agreed.length; i++) {
			this.me.agreed[i] = false;
		}
		$scope.save();
	};

	$scope.save = function() {
		var myData = 'type=fixeddates_employees&sqltype=UPDATE&id={0}&employeeId={1}&agreed1={2}&agreed2={3}&agreed3={4}&agreed4={5}&agreed5={6}&agreed6={7}'.format(
				this.fixedDate.id, this.me.id, this.me.agreed[0], this.me.agreed[1],
				this.me.agreed[2], this.me.agreed[3], this.me.agreed[4], this.me.agreed[5]);
		console.log(myData);
		$http.post('PutServlet?' + myData).success(function() {
			$route.reload();
		}).error(function(error) {
			console.log("Error when saving fixed dates: " + error);
		});
	};

	$scope.showGeneralTab = function () {
		$('#liProposals').removeClass('active');
		$('#liGeneral').addClass('active');
		$('#divGeneralWrapper').show();
		$('#divProposalWrapper').hide();
		return false;
	};

	$scope.showProposalTab = function () {
		$('#liProposals').addClass('active');
		$('#liGeneral').removeClass('active');
		$('#divGeneralWrapper').hide();
		$('#divProposalWrapper').show();
		return false;
	};
});