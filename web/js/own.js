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
};"use strict";
var myScope;
routeApp.controller('EmployeesCtrl', function ($http, $routeParams, $route, $location) {
	var ctrl = myScope = this;
	ctrl.myLocation = $location;

	ctrl.employees = [];
	ctrl.projects = [];
	ctrl.jobtitles = [
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

	//sorting
	ctrl.sortNameAsc = true, ctrl.sortCityAsc = true, ctrl.sortProjectAsc = true;
	ctrl.predicate = 'id';
	ctrl.reverse = false;

	ctrl.idParam = $routeParams.id ? '&id=' + $routeParams.id : '';
	console.log("param id=" + $routeParams.id);

	$http.get('GetServlet?type=employees' + ctrl.idParam).success(function (data) {
		ctrl.employees = data;
		ctrl.emp = ctrl.findEmp($('#user').text());
		if ($routeParams.id !== undefined) {
			ctrl.newEmployee = data[0];
			ctrl.isEditMode = true;
		}

		window.setTimeout(function () {
			$(".glyphicon").tooltip();
		}, 1000);
	}).error(function () {
		console.log("FAIL");
	});

	this.sortCol = function(pred) {
		ctrl.predicate = pred;
		switch (pred) {
			case "lastName":	ctrl.sortNameAsc = !ctrl.sortNameAsc;		break;
			case "city":		ctrl.sortCityAsc = !ctrl.sortCityAsc;		break;
			case "projectName": ctrl.sortProjectAsc = !ctrl.sortProjectAsc; break;
		}
		ctrl.reverse=!ctrl.reverse;
		return false;
	};

	this.sortNameClass = function() {
		return "sort glyphicon glyphicon-sort-by-alphabet" + (ctrl.sortNameAsc ? "" : "-alt");
	};

	this.sortProjectClass = function() {
		return "sort glyphicon glyphicon-sort-by-alphabet" + (ctrl.sortProjectAsc ? "" : "-alt");
	};

	this.sortCityClass = function() {
		return "sort glyphicon glyphicon-sort-by-alphabet" + (ctrl.sortCityAsc ? "" : "-alt");
	};
	this.findEmp = function (email) {
		for (var i = 0; i < ctrl.employees.length; i++) {
			if (ctrl.employees[i].email === email)
				return ctrl.employees[i];
		}
		return ctrl.employees[0];
	};

	this.loadProjects = function () {
		console.log("loadProjects");
		$http.get('GetServlet?type=projects' + ctrl.idParam).success(function (data) {
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

	this.addEmployee = function (e) {
		console.log("addEmployee");
		var qParam = "?sqlType={0}&type={1}&firstName={2}&lastName={3}&email={4}&jobtitle={5}&city={6}&projectId={7}&text={8}&image_file={9}".
				format("INSERT", "employees", e.firstName, e.lastName, e.email, e.jobtitle, e.city, 
					e.projectId, e.text, $("#image_file").val());
		$http.get('PutServlet' + qParam).success(function () {
			$location.path("/team");
		}).error(function() {
			console.log("error in addEmployee");
		});
	};

	this.findProject = function (id) {
		if (id === undefined || id === null)
			return "";
		console.log("find " + id + ", type=" + (typeof id));
		for (var i = 0; i < ctrl.projects.length; i++) {
			if (ctrl.projects[i].id === parseInt(id)) {
				return ctrl.projects[i].projectName + ", " + ctrl.projects[i].city;
			}
		}
		return "";
	};

	this.delete = function (id) {
		if (window.confirm("Do you really want to delete?")) {
			$http.post('DeleteServlet?type=employees&id=' + id).success(function (data) {
				$route.reload();
			}).error(function() {
				console.log("error in delete");
			});
		}
	};

	this.edit = function (id) {
		$location.path("/editEmployee/" + id);
	};
});
"use strict";
routeApp.controller('ProjectsCtrl', function(MyService) {
		var ctrl = this;
		ctrl.projects = [];

		MyService.loadProjects().then(function(d) {
			ctrl.projects = MyService.getProjects();
		});
//		ctrl.loadData = function() {
//			$http.get('GetServlet?type=projects').success(function (data) {
//				ctrl.projects = data;
//			}).error(function () {
//				console.log("FAIL");
//			});
//		};
	}
);
"use strict";
var myScope;

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

routeApp.controller('HolidayCtrl', function ($scope, $http, $route) {
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
	$scope.specialDays = [];
	$scope.calWeek = 0;

	$scope.me = {};
	$scope.userId = 0;

	var meInited = false;

	$scope.initMe = function(callback) {
		$http.get('GetServlet?type=employees&me=true').success(function (data) {
			$scope.me = data[0];
			$scope.userId = data[0].id;
			meInited = true;

			callback();
		});
	};

	$scope.init = function () {
		console.log("init");
		var options = {locale: "de", format: "DD.MM.YYYY", minDate: new Date()};
		$("#datepickerFrom, #datepickerTo").datetimepicker(options);

		if (!meInited)
			$scope.initMe(function() {
				$scope.initYear();
				$scope.initHolidayRequests();
			});
		else
			$scope.initHolidayRequests();
	};

	$scope.getCalWeek = function() {
		return this.calWeek++;
	};

	$scope.initHolidayRequests = function() {
		console.log("initHolidayRequests");

		$http.get('GetServlet?type=holidays&me=true').success(function (data) {
			$scope.takenDays = 0;
			$scope.myHolidays = data;
			$scope.countTakenDays();
			$scope.markMyHolidays();
			$("#tblExistingHolidays .glyphicon").tooltip();

			$http.get('GetServlet?type=specialdays&year=' + $scope.year).success(function (data) {
				$scope.specialDays = data;
				$scope.markSpecialDays();
//				http://stackoverflow.com/questions/13268361/bootstrap-tooltip-and-popover-add-extra-size-in-table
				$(".triona,.publicholiday").tooltip({container : 'body'});
			});
		}).error(function () {
			console.log("FAIL getHolidays");
		});
	};

	$scope.toggleHolidayList = function() {
		this.holidayListVisible = !this.holidayListVisible;
		return false;
	};

	$scope.chgYear = function (chg) {
		this.calWeek = 0;
		this.year += chg;
		this.initYear();
		this.initHolidayRequests();
	};

	$scope.countTakenDays = function () {
		this.remainingDays = this.me.holidays;
		for (var i = 0; i < this.myHolidays.length; i++) {
			if (this.year !== parseInt(this.myHolidays[i].from.substring(0,4)))
				continue;
			var workingDays = this.myHolidays[i].workingDays;
			this.takenDays += workingDays;
			this.remainingDays -= workingDays;
		}
		console.log("taken=" + this.takenDays + ", remaining=" + this.remainingDays);
	};

	$scope.updateFrom = function () {
		this.from = $("#datepickerFrom input").val();
		this.calcDays();
	};
	$scope.updateTo = function () {
		this.to = $("#datepickerTo input").val();
		this.calcDays();
	};

	$scope.delete = function(id) {
		if (window.confirm('Do you really want to delete this?')) {
			$http.get('DeleteServlet?type=holidays&id=' + id).success(function (data) {
				$route.reload();
			}).error(function (error) {
				console.log("FAIL delete holiday " + id + ", error=" + error);
			});
		}
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

	$scope.markSpecialDays = function() {
		for (var i = 0; i < $scope.specialDays.length; i++) {
			var specialDay = $scope.specialDays[i];
			var tokens = specialDay.day.split("-");
			var d = new Date(tokens[0], tokens[1]-1, tokens[2], 0, 0, 0, 0);
			$scope.markDate(d.getFullYear(), d.getMonth(), d.getDate(), false, specialDay.type, specialDay.name);
		}
	};

	$scope.markDates = function (fromDate, toDate, isTaken, type) {
		var workingDays = 0;
		for (var i = 0; i < $scope.months.length; i++)
			$("#" + $scope.months[i] + " tbody td.btn-warning").removeClass("btn-warning");

		while (toDate.getTime() >= fromDate.getTime()) {
			if (toDate.getDay() >= 1 && toDate.getDay() <= 5) {
				var tdOfDay = $("#" + $scope.months[toDate.getMonth()] + " td.publicholiday:contains(" + toDate.getDate() + ")");
				if (tdOfDay.length === 0)
					workingDays++;
				this.markDate(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), isTaken);
			}
			toDate.setTime(toDate.getTime() - $scope.DAY_IN_MS);	// set to previous day
		}
		return workingDays;
	};

	$scope.markDate = function (year, month, day, isTaken, type, name) {
		if (year !== this.year)
			return;

		var tblOfMonth = $("#" + $scope.months[month] + " tbody");
		var tdOfMonth = tblOfMonth.find("td").not(".outOfMth,.red");
		tdOfMonth.each(function () {
			if (parseInt($(this)[0].innerHTML) === day) {
				if (type === "triona")
					$(this).addClass("btn-info triona").attr("title", name);
				else if (type === "holiday")
					$(this).addClass("red publicholiday").attr("title", name);
				else if (isTaken)
					$(this).addClass("btn-success");
				else if (!isTaken)
					$(this).addClass("btn-warning");
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
			if (tdOfI.hasClass("red"))
				tdOfI.removeClass("red");
			if (tdOfI.hasClass("btn-info"))
				tdOfI.removeClass("btn-info");
			if ( (d.getDay() === 0 || d.getDay() === 6) && !tdOfI.hasClass("red") )
				tdOfI.addClass("red");

			if (d.getDay() === 1)
				tdOfI.parent().attr("title", "KW " + d.getWeek() % 52);

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
		console.log("initYear took " + parseInt(window.performance.now() - t1) + " ms");
	};

	$scope.gotoToday = function () {
		$scope.year = new Date().getFullYear();
		$scope.initYear();
	};

	$scope.save = function() {
		console.log($scope.from + "-" + $scope.to + ":" + $scope.workingDays);
		var qParam = "?sqlType={0}&type={1}&employeeId={2}&fromDate={3}&toDate={4}&workingDays={5}".
				format("INSERT", "holidays", $scope.userId, $scope.from, $scope.to, $scope.workingDays);
		$http.get("PutServlet" + qParam).success(function (data) {
			$route.reload();
		}).error(function() {
			console.log("error in save()");
		});
	};

	$scope.reset = function () {
		$scope.from = "", $scope.to = "";
	};

	$scope.init();
});
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
});routeApp.factory('MyService', function ($http) {
	var promiseEmployees, promiseFixedDates, promiseProjects;
	var employees = [];
	var fixedDates = [];
	var me = {};
	var projects = [];
	var myService = {
		loadEmployees: function () {
			if (!promiseEmployees) {
				promiseEmployees = $http.get('GetServlet?type=employees').then(function (response) {
					console.log("employees loaded over http");
					employees = response.data;

					// find myself among the team members
					var myEmail = $("#navbar #user").text();
					for (var i = 0; i < employees.length; i++) {
						if (myEmail === employees[i].email)
							me = employees[i];
					}
				});
			}
			console.log("getting cached promiseEmployees");
			return promiseEmployees;
		},
		loadFixedDates: function () {
			if (!promiseFixedDates) {
				promiseFixedDates = $http.get('GetServlet?type=fixeddates').then(function (response) {
					console.log("fixedDates loaded over http");
					fixedDates = response.data;
				});
			}
			return promiseFixedDates;
		},
		loadProjects: function () {
			if (!promiseProjects) {
				promiseProjects = $http.get('GetServlet?type=projects').then(function (response) {
					console.log("projects loaded over http");
					projects = response.data;
				});
			}
			console.log("getting cached promiseProjects");
			return promiseProjects;
		},
		getEmployees: function () {
			return employees;
		},
		getProjects: function () {
			return projects;
		},
		getMe: function () {
			return me;
		},
		getFixedDates: function () {
			return fixedDates;
		}
	};
	return myService;
});
