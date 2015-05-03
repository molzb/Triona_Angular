var routeApp = angular.module('routeApp', ['ngRoute']);
routeApp.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider.
				when('/home',		{templateUrl: 'home.html'}).
				when('/team',		{templateUrl: 'team.html'}).
				when('/projects',	{templateUrl: 'projects.html'}).
				when('/holidays',	{templateUrl: 'holidays.html'}).
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
}"use strict";
var myScope;
routeApp.controller('EmployeesController', function ($http, $routeParams, $location) {
	var ctrl = myScope = this;

	ctrl.employees = [];
	ctrl.projects = [];
	ctrl.jobTitles = [
		{name: 'Junior-Consultant', id: 0},
		{name: 'Consultant', id: 1},
		{name: 'Lead Consultant', id: 2},
		{name: 'Senior Consultant', id: 3},
		{name: 'CEO', id: 4}];

	ctrl.searchTerm = '';
	ctrl.orderBy = '';
	ctrl.newEmployee = {};
	ctrl.emp = {};
	ctrl.isEditMode = false;

	var idParam = $routeParams.id ? '&id=' + $routeParams.id : '';
	$http.get('GetServlet?type=employees' + idParam).success(function (data) {
		ctrl.employees = data;
		ctrl.emp = ctrl.findEmp($('#user').text());
		window.setTimeout(function () {
			$(".glyphicon").tooltip();
		}, 1000);
	}).error(function () {
		console.log("FAIL");
	});

	this.findEmp = function (email) {
		for (var i = 0; i < ctrl.employees.length; i++) {
			if (ctrl.employees[i].email === email)
				return ctrl.employees[i];
		}
		return ctrl.employees[0];
	};

	this.loadProjects = function () {
		console.log("loadProjects");
		$http.get('GetServlet?type=projects' + idParam).success(function (data) {
			ctrl.projects = data;
		}).error(function () {
			console.log("FAIL");
		});
	};

	this.getEmp = function (idx) {
		return this.employees[idx];
	};

	this.search = function (searchT) {
		console.log(searchT);
		this.searchTerm = searchT;
	};

	this.addEmployee = function () {
		console.log("addEmployee");
		$http.post('PutServlet', JSON.stringify(ctrl.newEmployee)).success(function () {
			$location.path("#team");
		});
	};

	this.delete = function (id) {
		if (window.confirm("Do you really want to delete?")) {
			$http.get('DeleteServlet?type=employees&id=' + id).success(function (data) {
				console.log("Return-Code" + data);
				$rootScope.$apply(function () {
					$location.path("#team");
				});
			});
		}
	};

	this.edit = function (id) {
		console.log("edit");
	};
}
);
"use strict";
routeApp.controller('ProjectsController', ['$http', '$log', function ($http, $log) {
		var ctrl = this;

		ctrl.projects = [];

		ctrl.searchTerm = '';
		ctrl.orderBy = '';

		$http.get('GetServlet?type=projects').success(function (data) {
			ctrl.projects = data;
		}).error(function () {
			console.log("FAIL");
		});

		this.range = function (n) {
			console.log("range " + n);
			return new Array(n);
		};

		this.search = function (searchT) {
			console.log(searchT);
			this.searchTerm = searchT;
		};

		this.addProject = function () {
			console.log("addProject");
		};
	}
]);
"use strict";
var myScope;

routeApp.controller('holidayCtrl', function ($scope, $http) {
	myScope = $scope;
	$scope.year = new Date().getFullYear();
	$scope.today = new Date();
	$scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	$scope.DAY_IN_MS = 1000 * 60 * 60 * 24;
	$scope.from = null, $scope.to = null;
	$scope.workingDays = 0;
	$scope.remainingDays = 0;
	$scope.takenDays = 0;
	$scope.fromDate = null;
	$scope.toDate = null;
	$scope.myHolidays = [];
	$scope.holidayListVisible = false;

	$scope.me = {};
	$scope.userId = 0;

	$http.get('GetServlet?type=employees&me=true').success(function (data) {
		$scope.me = data[0];
		$scope.userId = data[0].id;

		$http.get('GetServlet?type=holidays&me=true').success(function (data) {
			$scope.myHolidays = data;
			$scope.countTakenDays();
			window.setTimeout(function() {
				$scope.markMyHolidays();
			}, 500);

			$scope.init();
		}).error(function () {
			console.log("FAIL getHolidays");
		});

	}).error(function () {
		console.log("FAIL getEmployee");
	});

	$scope.toggleHolidayList = function() {
		this.holidayListVisible = !this.holidayListVisible;
		return false;
	};

	$scope.chgYear = function (chg) {
		this.year += chg;
		this.initYear();
	};

	$scope.countTakenDays = function () {
		this.remainingDays = this.me.holidays;
		for (var i = 0; i < this.myHolidays.length; i++) {
			var workingDays = this.myHolidays[i].workingDays;
			this.takenDays += workingDays;
			this.remainingDays -= workingDays;
		}
		console.log("taken=" + this.takenDays + ", remaining=" + this.remainingDays);
	};

	$scope.updateFrom = function () {
		this.from = $("#datepickerFrom input").val();
		console.log("from=" + this.from);
		this.calcDays();
	};
	$scope.updateTo = function () {
		this.to = $("#datepickerTo input").val();
		console.log("to=" + this.to);
		this.calcDays();
	};

	$scope.calcDays = function () {
		if (this.from === null || this.to === null)
			return;
		this.workingDays = 0;
		this.remainingDays = this.me.holidays - this.takenDays;
		var fromTokens = this.from.split(".");
		var toTokens = this.to.split(".");
		this.fromDate = new Date(fromTokens[2], fromTokens[1] - 1, fromTokens[0], 0, 0, 0, 0);
		this.toDate = new Date(toTokens[2], toTokens[1] - 1, toTokens[0], 0, 0, 0, 0);
		this.workingDays = this.markDates(this.fromDate, this.toDate, false);
		this.remainingDays -= this.workingDays;
	};

	$scope.markMyHolidays = function() {
			for (var i = 0; i < $scope.myHolidays.length; i++) {
			var fromTokens = $scope.myHolidays[i].from.split("-");
			var toTokens   = $scope.myHolidays[i].to.split("-");
			var fromDate = new Date(fromTokens[0], fromTokens[1]-1, fromTokens[2], 0, 0, 0, 0);
			var toDate   = new Date(toTokens[0], toTokens[1]-1, toTokens[2], 0, 0, 0, 0);
			$scope.markDates(fromDate, toDate, true);
		}
	};

	$scope.markDates = function (fromDate, toDate, isTaken) {
		var workingDays = 0;
		while (toDate.getTime() >= fromDate.getTime()) {
			if (toDate.getDay() >= 1 && toDate.getDay() <= 5) {
				workingDays++;
				this.markDate(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), isTaken);
			}
			toDate.setTime(toDate.getTime() - $scope.DAY_IN_MS);	// set to previous day
		}
		return workingDays;
	};

	$scope.markDate = function (year, month, day, isTaken) {
		if (year !== this.year)
			return;

		var tblOfMonth = $("#" + $scope.months[month] + " tbody");
		var tdOfMonth = tblOfMonth.find("td").not(".outOfMth,.red");
		console.log("mark " + day + "." + $scope.months[month] + " " + year + ", tdOfMonth len=" + tdOfMonth.length);
		tdOfMonth.each(function () {
			if (parseInt($(this)[0].innerHTML) === day) {
				$(this).addClass(isTaken ? "btn-success" : "btn-danger");
			}
		});
	};

	$scope.initMonth = function (monthNumber) {
		var first = new Date($scope.year, monthNumber, 1, 0, 0, 0, 0);
		var firstOfNextMth = new Date($scope.year, monthNumber + 1, 1, 0, 0, 0, 0);
		var d = new Date(first.getTime());
		while (d.getDay() !== 1) {	// monday
			d.setTime(d.getTime() - $scope.DAY_IN_MS);
		}
		var id = $scope.months[monthNumber];
		var tdsOfI = $("#" + id + " tbody td");
		tdsOfI.each(function (i) {
			if (i > 36)
				return;	// it can't go any farther

			var tdOfI = $(this);
			if (d.getTime() < first.getTime()) {					// previous month
				tdOfI.addClass("outOfMth").text(d.getDate());
			} else if (d.getTime() < firstOfNextMth.getTime()) {	// current month
				tdOfI.removeClass("outOfMth").text(d.getDate());
			} else {												// next month
				tdOfI.addClass("outOfMth").text(d.getDate());
				if (i > 34)
					tdOfI.html("&nbsp;");
			}
			if (tdOfI.hasClass("today"))
				tdOfI.removeClass("today");
			if (tdOfI.hasClass("btn-danger"))
				tdOfI.removeClass("btn-danger");
			if (tdOfI.hasClass("btn-success"))
				tdOfI.removeClass("btn-success");

			if (d.getFullYear() === $scope.today.getFullYear() &&
					d.getMonth() === $scope.today.getMonth() &&
					d.getDate() === $scope.today.getDate() &&
					!tdOfI.hasClass("outOfMth")) {
				tdOfI.addClass("today");
			}
			d.setTime(d.getTime() + $scope.DAY_IN_MS);
		});
	};

	$scope.initYear = function () {
		var t1 = window.performance.now();
		for (var i = 0; i < 12; i++)
			this.initMonth(i);
		console.log("initYear took " + (window.performance.now() - t1) + " ms");
	};

	$scope.gotoToday = function () {
		$scope.year = new Date().getFullYear();
		$scope.initYear();
	};

	$scope.reset = function () {
		$scope.from = "", $scope.to = "";
	};

	$scope.init = function () {
		$scope.initYear();
		var options = {locale: "de", format: "DD.MM.YYYY", minDate: new Date()};
		$("#datepickerFrom, #datepickerTo").datetimepicker(options);
	};
});
