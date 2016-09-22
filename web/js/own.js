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
				when('/holidays',	{templateUrl: 'holidays.jsp'}).
				when('/employee',	{templateUrl: 'detailEmployee.html'}).
				when('/addEmployee',{templateUrl: 'addEmployee.html'}).
				when('/detailEmployee/:id', {templateUrl: 'detailEmployee.html'}).
				when('/editEmployee/:id',	{templateUrl: 'addEmployee.html'}).
				when('/timesheets',			{templateUrl: 'timesheets.html'}).
				when('/editTimesheet/:id',	{templateUrl: 'addTimesheet.html'}).
				when('/fixedDates',			{templateUrl: 'fixedDates.html'}).
				when('/editFixedDate/:id',	{templateUrl: 'addFixedDate.jsp'}).
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
routeApp.factory('CalendarService', function ($scope) {
	$scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.year = new Date().getFullYear();
	$scope.month = new Date().getMonth();
	$scope.m = $scope.months[$scope.month];
	$scope.today = new Date();
	$scope.DAY_IN_MS = 1000 * 60 * 60 * 24;

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
			if ((d.getDay() === 0 || d.getDay() === 6) && !tdOfI.hasClass("red"))
				tdOfI.addClass("red");

			if (d.getDay() === 1)
				tdOfI.parent().attr("title", "KW " + d.getWeek() % 52);

			if (d.getFullYear() === $scope.today.getFullYear() &&
					d.getMonth() === $scope.today.getMonth() &&
					d.getDate() === $scope.today.getDate() &&
					!tdOfI.hasClass("outOfMth")) {
				tdOfI.addClass("today");
			}
			if (d > $scope.today && !tdOfI.hasClass("outOfMth"))
				tdOfI.addClass("present");
			d.setTime(d.getTime() + $scope.DAY_IN_MS);
		});
	};

});
"use strict";
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
routeApp.controller('ProjectsCtrl', function (MyService) {
	var ctrl = this;
	ctrl.projects = [];

	MyService.loadProjects().then(function (d) {
		ctrl.projects = MyService.getProjects();
	});
});
"use strict";
var myHolidayScope;

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
};

routeApp.controller('HolidayCtrl', function ($scope, $http, $route, MyService) {
	myHolidayScope = $scope;
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

	var meInited = false;

	$scope.initMe = function(callback) {
		MyService.loadEmployees().then(function (d) {
			$scope.employees = MyService.getEmployees();
			$scope.me = MyService.getMe();
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
			d.setDate(d.getDate() + 1);
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
				format("INSERT", "holidays", $scope.me.id, $scope.from, $scope.to, $scope.workingDays);
		$http.get("PutServlet" + qParam).success(function () {
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
routeApp.controller('FixedDateCtrl', function ($scope, $location, $route, $http, $routeParams, MyService) {
	myFixedDateScope = $scope;
	$scope.employees = [];
	$scope.fixedDates = [];
	$scope.fixedDate = {};
	$scope.fixedDatesEmployees = [];
	$scope.agreed1 = [];
	$scope.agreed2 = [];
	$scope.agreed3 = [];
	$scope.agreed4 = [];
	$scope.agreed5 = [];
	$scope.agreed6 = [];
	$scope.me = {};
	$scope.newFixedDate = {};

	MyService.loadEmployees().then(function () {
		$scope.employees = MyService.getEmployees();
		$scope.me = MyService.getMe();
		$scope.initMonth($scope.month);

		MyService.loadFixedDates().then(function () {
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

			MyService.loadFixedDatesEmployees($scope.fixedDate.id).then(function () {
				$scope.fixedDatesEmployees = MyService.getFixedDatesEmployees();
				insertAgreedIntoEmployeesArray();
				addMouseOverEventInOverview();
				$("#divFixedDates").show();
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

	$scope.findFixedDate = function (fixedDates, id) {
		if (id === -1)
			return fixedDates[0];
		for (var j = 0; j < fixedDates.length; j++) {
			if (fixedDates[j].id === id)
				return fixedDates[j];
		}
		return null;
	};

	$scope.isChecked = function (employeeId, dateIdx) {
		for (var i = 0; i < $scope.fixedDatesEmployees.length; i++) {
			var emp = $scope.fixedDatesEmployees[i];
			if (emp.employeeId === employeeId) {
				return emp.agreed[dateIdx - 1] === true;
			}
		}
		return false;
	};

	$scope.preventSubmit = function(e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			return false;
		}
	};

	function addMouseOverEventInOverview() {
		var pnls = $("#fixedDatesOverview .panel");
		pnls.mouseenter(function () {
			$(this).addClass('panel-primary').removeClass('panel-default');
		});
		pnls.mouseleave(function () {
			$(this).removeClass('panel-primary').addClass('panel-default');
		});
	}

	$scope.isCheckedCssTr = function (emp, idx) {
		if (emp.id === $scope.me.id)
			return '';
		if (!emp.agreed || emp.agreed[idx] === null)
			return 'grey';
		return emp.agreed[idx] === true ? 'alert-success' : 'alert-danger';
	};

	$scope.isCheckedCssIcon = function (emp, idx) {
		if (!emp.agreed || emp.agreed[idx] === null)
			return '';
		return emp.agreed[idx] === true ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove';
	};

	$scope.title = function (employeeId, dateIdx) {
		return this.isChecked(employeeId, dateIdx) ? "Yes, I can" : "No, I can't";
	};

	$scope.cannotMakeIt = function () {
		for (var i = 0; i < this.me.agreed.length; i++) {
			this.me.agreed[i] = false;
		}
		$scope.save();
	};

	$scope.save = function () {
		var myData = 'type=fixeddates_employees&sqltype=UPDATE&id={0}&employeeId={1}&agreed1={2}&agreed2={3}&agreed3={4}&agreed4={5}&agreed5={6}&agreed6={7}'.format(
				this.fixedDate.id, this.me.id, this.me.agreed[0], this.me.agreed[1],
				this.me.agreed[2], this.me.agreed[3], this.me.agreed[4], this.me.agreed[5]);
		console.log(myData);
		$http.post('PutServlet?' + myData).success(function () {
			$route.reload();
		}).error(function (error) {
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

	$scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	$scope.daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	$scope.year  = new Date().getFullYear();
	$scope.month = new Date().getMonth();
	$scope.m = $scope.months[$scope.month];
	$scope.today = new Date();
	$scope.DAY_IN_MS = 1000 * 60 * 60 * 24;
	
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
			if ((d.getDay() === 0 || d.getDay() === 6) && !tdOfI.hasClass("red"))
				tdOfI.addClass("red");

			if (d.getDay() === 1)
				tdOfI.parent().attr("title", "KW " + d.getWeek() % 52);

			if (d.getFullYear() === $scope.today.getFullYear() &&
					d.getMonth() === $scope.today.getMonth() &&
					d.getDate() === $scope.today.getDate() &&
					!tdOfI.hasClass("outOfMth")) {
				tdOfI.addClass("today");
			}
			if (d > $scope.today && !tdOfI.hasClass("outOfMth"))
				tdOfI.addClass("present");
			d.setTime(d.getTime() + $scope.DAY_IN_MS);
		});
		initCalendarCellClicked();
	};

	$scope.isFutureDate = function() {
		var currentYear = $scope.today.getYear() + 1900;
		var currentMonth = $scope.today.getMonth();
		return $scope.year > currentYear || ($scope.year === currentYear && $scope.month > currentMonth);
	};

	$scope.chgMonth = function (chg) {
		var tblId = $("#" + $scope.months[$scope.month]);
		$(".calendar td.alert-success").removeClass("alert-success");
		if ($scope.month === 11 && chg === 1) {
			$scope.month = 0;
			$scope.year++;
		} else if ($scope.month === 0 && chg === -1) {
			$scope.month = 11;
			$scope.year--;
		} else {
			$scope.month += chg;
		}
		tblId.attr("id", $scope.months[$scope.month]);
		$scope.m = $scope.months[$scope.month];
		$scope.initMonth($scope.month);

		$(".glyphicon-trash").each(function() {
			var yyyy_mm_dd = $(this).data("yyyy_mm_dd");
			if (yyyy_mm_dd !== "") {
				var dateTokens = yyyy_mm_dd.split("-");
				if (parseInt(dateTokens[0]) === $scope.year && parseInt(dateTokens[1]) === $scope.month) {
					$(".calendar td.present").filter(function() {
						return $(this).text() === dateTokens[2];
					}).addClass("alert-success");
				}
			}
		});
	};

	$scope.isDateSelected = function() {
		return $(".selectedDates .selection:visible").length > 0;
	};

	$scope.enableOnlyNumbers = function(e) {
		var allowedKeycodes = [48,49,50,51,52,53,54,55,56,57,	37,39,	8,9,16,190];	// 0-9, <-,->,  :,Tab,BS
		if ($.inArray(e.keyCode, allowedKeycodes) === -1)
			e.preventDefault();
	};

	/** time is valid, when it has the format hh:mm and hour and minutes must be valid numbers (0-23, 0-59) */
	$scope.isTimeSelectedAndValid = function() {
		var isValid = false;
		var regexTime = new RegExp(/[0-9]{1,2}:[0-9]{2}/);
		$(".selectedDates .panel-body input[type=text]:visible").each(function() {
			if ($(this).val().match(regexTime)) {
				var hourMin = $(this).val().split(":");
				if (parseInt(hourMin[0]) >= 0 && parseInt(hourMin[0]) <= 23 &&
					parseInt(hourMin[1]) >= 0 && parseInt(hourMin[1]) <= 59)
					isValid = true;
			}
		});
		return isValid;
	};

	$scope.validateSave = function(e) {
		if ($scope.isTimeSelectedAndValid()) {
			$(".selectedDates .btn-success").removeAttr("disabled");
			$(e.target).removeClass("alert-danger");
		} else {
			$(".selectedDates .btn-success").attr("disabled", "disabled");
			$(e.target).addClass("alert-danger");
		}
	};

	/**
	 * Formats a given date like that: Thu, 31.12.
	 * @param {Date} d
	 * @returns {String} e.g. Thu, 31.12.
	 */
	$scope.formatDDD_DD_MM = function(d) {
		var dayOfWeek = $scope.daysOfWeek[d.getDay()];	// Mon, Tue, ...
		return dayOfWeek + ", " + d.getDate() + "." + (d.getMonth() + 1) + ".";
	};

	$scope.selection = [];
	$scope.dummyArrayWith6Entries = [0,1,2,3,4,5];

	$scope.selectDay = function(elem) {
		var dayInMth = $(elem).text();
		var date = new Date($scope.year, $scope.month, dayInMth);
		var dateFormatted = $scope.formatDDD_DD_MM(date);
		$(elem).addClass("alert-success");

		// already inserted? If so, highlight cell with the selected date
		var idx = $.inArray(dateFormatted, $scope.selection);
		if (idx > -1) {
			highlightSelection(idx);
			return false;
		}

		var selectedDatesDivs = $(".selectedDates div span.date");
		var i = 0;
		selectedDatesDivs.each(function () {
			if ($(this).text() === "") {
				$scope.selection[i] = dateFormatted;
				if (date.getDay() === 6 || date.getDay() === 0)
					$(this).addClass("weekend");
				$(this).text($scope.selection[i]).parent().show();
				var yyyy_mm_dd = $scope.year + "-" + $scope.month + "-" + dayInMth;
				$(this).parent().find(".glyphicon-trash").data("yyyy_mm_dd", yyyy_mm_dd);
				$(this).parent().find("input[name=sel" + i + "Date]").val(yyyy_mm_dd);
				return false;
			}
			i++;
		});
		$(".selectedDates h4").hide();
	};

	$scope.removeSelection = function(jqElem, idx, yyyy_mm_dd) {
		console.log(idx + ":" + $scope.selection[idx]);
		$scope.selection[idx] = "";
		jqElem.parent().find(".date").text("");
		var dateTokens = yyyy_mm_dd.split("-");
		if (parseInt(dateTokens[0]) === $scope.year && parseInt(dateTokens[1]) === $scope.month)
			$(".calendar td.present:contains(" + dateTokens[2] + ")").removeClass("alert-success");
		jqElem.parent().hide();

		$(".selectedDates h4").css("display", $scope.isDateSelected() ? "none" : "block");
	};

	$scope.saveFixedDate = function() {
		var qParams = $("form[name=frmFixedDate]").serialize();
		$http.post('PutServlet?' + qParams).success(function() {
			$location.path('/fixedDates');
		}).error(function(e) {
			alert("error " + e);
			$location.path('/fixedDates');
		});
	};

	$scope.deleteFixedDate = function(id) {
		if (window.confirm("Do you really want to delete this entry?")) {
			$http.post('DeleteServlet?type=fixeddates&id=' + id).success(function() {
				MyService.clearPromiseFixedDates();
				$route.reload();
			}).error(function() {
				alert("ERROR: Couldn't delete this fixed date");
			});
		}
	};

	function initCalendarCellClicked() {
		$(".calendar table tbody td.present").click(function() { return false; });	//unbind
		$(".calendar table tbody td.present").click(function() {
			$scope.selectDay(this);
		});
		$(".selectedDates .glyphicon-trash").click(function() {
			$scope.removeSelection($(this), parseInt($(this).data("idx")), $(this).data("yyyy_mm_dd"));
		});
	}

	function highlightSelection(idx) {
		var sel = $("#selection" + idx + " .date");
		sel.toggleClass("alert-danger"); window.setTimeout(function() {
			sel.toggleClass("alert-danger");
		}, 200);
	}
});"use strict";
var myScope;

routeApp.controller('TimesheetCtrl', function ($scope, $http, $route, $routeParams, $location) {
	myScope = $scope;
	$scope.year = new Date().getFullYear();
	$scope.today = new Date();
	$scope.months = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"];
	$scope.specialDays = [];

	$scope.DAY_IN_MS = 1000 * 60 * 60 * 24;
	$scope.timesheet = null;

	// some stats
	$scope.workingHoursYear = "";
	$scope.workingDaysYear = 0;
	$scope.workingHoursMonth = [];
	$scope.workingDaysMonth = [];
	$scope.bestWorkingMonth = 0;
	$scope.worstWorkingMonth = 0;
	$scope.timesheetMonthExists = [];
	$scope.isEditMode = false;

	$scope.timesheetCurrentMonthName = "";
	$scope.timesheetCurrentMonth = [];
	$scope.timesheetCurrentMonthIndex = -1;
	$scope.timesheetSumDays = -1;
	$scope.timesheetSumHours = 0;
	$scope.timesheetSumDiff = 0;

	$scope.me = {};
	$scope.prmId;

	var meInited = false;

	$scope.initMe = function(callback) {
		$http.get('GetServlet?type=employees&me=true', {cache: true}).success(function (data) {
			$scope.me = data[0];
			meInited = true;

			$http.get('GetServlet?type=specialdays&year=' + $scope.year, {cache: true}).success(function (data) {
				$scope.specialDays = data;
			});

			callback();
		});
	};

	$scope.init = function () {
		if (!meInited) {
			$scope.initMe(function() {
				$scope.initTimesheet();
			});
		}
	};

	$scope.initTimesheet = function() {
		console.log("initTimesheet");

		$http.get('GetServlet?type=timesheets&me=true&year=' + $scope.year).success(function (data) {
			$scope.prmId = $routeParams.id;
			if ($scope.prmId !== undefined && $scope.prmId !== null) {
				$scope.timesheetCurrentMonthIndex = parseInt($scope.prmId.split(",")[0]);
				$scope.timesheetCurrentMonthName = $scope.months[$scope.timesheetCurrentMonthIndex];
			}

			$scope.timesheet = data;
			$scope.calcStats($scope.timesheet);
			if ($scope.timesheetCurrentMonthIndex > -1) {
				$scope.filterMonth($scope.timesheetCurrentMonthIndex);
			}
		}).error(function () {
			console.log("FAIL initTimesheet");
		});
	};

	$scope.filterMonth = function(mthIndex) {
		$scope.timesheetSumDays = 0;

		// init daily entries with default data
		var d = new Date($scope.year, mthIndex, 1, 0,0,0,0);
		while (d.getMonth() === mthIndex) {
			var specialDay = getSpecialDay(d);
			var entry = {employee_id: $scope.me.id,
				jsDate:		d,
				jsDateClass:specialDay !== null ? "weekend" : "",
				isWorkingDay:specialDay === null,
				from:		null,
				to:			null,
				pause:		null,
				duration:	null,
				diff:		0,
				comment:	specialDay !== null ? specialDay.name : $scope.me.projectName};
			$scope.timesheetCurrentMonth.push(entry);
			
			d = new Date(d.getTime() + $scope.DAY_IN_MS);
		}

		// overwrite default data with real data
		for (var i = 0; i < $scope.timesheet.length; i++) {
			var entry = $scope.timesheet[i];
			var jsDate = convertDateToJsDate(entry.day);
			if (jsDate.getMonth() === mthIndex) {
				entry.jsDate = jsDate;
				entry.isWorkingDay = jsDate.getDay() >= 1 && jsDate.getDay() <= 5;
				
				$scope.timesheetCurrentMonth[jsDate.getDate() - 1] = entry;
			}
		}
		this.calcMonthTotals();
	};

	$scope.calcMonthTotals = function() {
		$scope.timesheetSumDays = 0, $scope.timesheetSumHours = 0, $scope.timesheetSumDiff = 0;

		for (var i = 0; i < $scope.timesheetCurrentMonth.length; i++) {
			var t = $scope.timesheetCurrentMonth[i];
			if (t.from !== null && t.to !== null && t.duration !== null && t.duration !== "") {
				$scope.timesheetSumDays++;
				var durationInMins = convertHhmmToMinutes(t.duration);
				$scope.timesheetSumHours += durationInMins;
				$scope.timesheetSumDiff += durationInMins - 480;
			}
		}
	};

	/**
	 * Check, if date is a special day and returns the appropriate JSON object
	 * @param {Date} jsDate
	 * @returns {JSON} json or null, when it's not a special day (weekend or public holiday, but not meeting)
	 */
	var getSpecialDay = function(jsDate) {
		if (jsDate.getDay() === 6 || jsDate.getDay() === 0)
			return {name: "Weekend"};
		for (var i = 0; i < $scope.specialDays.length; i++) {
			if ($scope.specialDays[i].type === "triona")
				continue;
			var spDay = convertDateToJsDate($scope.specialDays[i].day);
			if (jsDate.getMonth() === spDay.getMonth() && jsDate.getDate() === spDay.getDate())
				return $scope.specialDays[i];
		}
		return null;
	};

	/**
	 * Converts a string, e.g. "2015-12-31", to a JS date
	 * @param {String} time_yyyymmdd pattern "yyyy-mm-dd"
	 * @returns {Date} JS date object
	 */
	var convertDateToJsDate = function(time_yyyymmdd) {
		if (time_yyyymmdd === undefined || time_yyyymmdd === "")
			return null;
		var timeTokens = time_yyyymmdd.split("-");
		return new Date(timeTokens[0], timeTokens[1]-1, timeTokens[2], 0,0,0,0);
	};

	$scope.calcStats = function(timesheet) {
		$scope.workingDaysMonth  = [0,0,0,0,0,0, 0,0,0,0,0,0], $scope.workingDaysYear  = 0;
		$scope.workingHoursMonth = [0,0,0,0,0,0, 0,0,0,0,0,0], $scope.workingHoursYear = 0;
		$scope.timesheetMonthExists = [false,false,false,false,false,false,  false,false,false,false,false,false];
		var workingMinutesMonth  = [0,0,0,0,0,0, 0,0,0,0,0,0], workingMinutesYear = 0;
		var month = 0;

		for (var i = 0; i < timesheet.length; i++) {
			var dayInT = timesheet[i];
			var dayTokens = dayInT.day.split("-");
			month = dayTokens[1] - 1;
			$scope.workingDaysMonth[month]++;
			$scope.workingDaysYear++;
			workingMinutesMonth[month] += convertHhmmToMinutes(dayInT.duration);
			workingMinutesYear += convertHhmmToMinutes(dayInT.duration);
			$scope.timesheetMonthExists[month] = true;
		}

		$scope.workingHoursYear = workingMinutesYear;

		for (var i = 0, worstIdx = 0, bestIdx = 0; i <= month; i++) {
			$scope.workingHoursMonth[i] = workingMinutesMonth[i];
			
			if ($scope.workingHoursMonth[i] > $scope.workingHoursMonth[bestIdx]) {
				$scope.bestWorkingMonth = i;
				bestIdx = i;
			}
			if ($scope.workingHoursMonth[i] < $scope.workingHoursMonth[worstIdx]) {
				$scope.worstWorkingMonth = i;
				worstIdx = i;
			}
		}
	};

	$scope.calcWorkingHours = function(from, to, pause) {
		if (from === null || to === null || from === "" || to === "")
			return 0;
		var fromMins = convertHhmmToMinutes(from);
		var toMins = convertHhmmToMinutes(to);
		var pauseMins = convertHhmmToMinutes(pause);
		if (pauseMins === Math.NaN)
			pauseMins = 0;
		if (fromMins === Math.NaN || toMins === Math.NaN)
			return 0;

		return fromMins - toMins - pauseMins;
	};

	$scope.calcDiff = function(from, to, pause) {
		if (from === null || to === null || from === "" || to === "")
			return 0;
		var fromMins = convertHhmmToMinutes(from);
		var toMins = convertHhmmToMinutes(to);
		var pauseMins = convertHhmmToMinutes(pause);
		if (pauseMins === Math.NaN)
			pauseMins = 0;
		if (fromMins === Math.NaN || toMins === Math.NaN)
			return 0;

		return fromMins - toMins - pauseMins - 480;
	};

	$scope.calcDiffClass = function(from, to, pause) {
		var diff = $scope.calcDiff(from, to, pause);
		if (diff === undefined || diff === Math.NaN || diff === 0)
			return "";
		return diff > 0 ? "text-success" : "text-danger";
	};

	$scope.hasTimesheet = function(idx) {
		return $scope.timesheetMonthExists[idx];
	};

	$scope.keydownCheck = function(e) {
		// allowed: 0-9, :, BS, left, right
		var keyOk = (e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === 8 || e.keyCode === 190 ||
				e.keyCode === 37 || e.keyCode === 39;
		if (!keyOk)
			e.preventDefault();
	};

	/**
	 * Converts a time (HH:mm) into a minute value
	 * @param {String} '08:30' or '8:30'
	 * @returns {Number} 510 (for 8 * 60 + 30)
	 */
	var convertHhmmToMinutes = function(hhmm) {
		if (typeof hhmm !== "string")
			return Math.NaN;
		if (hhmm.length < 4 || hhmm.length > 5)
			return Math.NaN;
		var colonIdx = hhmm.indexOf(':');
		if (colonIdx === -1)
			return Math.NaN;
		var hours = parseInt(hhmm.substring(0,colonIdx));
		var minutes = parseInt(hhmm.substring(colonIdx+1));
		return hours * 60 + minutes;
	};

	$scope.isBestMonth = function(idx) {
		return this.bestWorkingMonth === idx;
	};

	$scope.isWorstMonth = function(idx) {
		return this.worstWorkingMonth === idx;
	};

	$scope.yearIsNow = function() {
		return $scope.year === $scope.today.getFullYear();
	};

	$scope.chgYear = function (chg) {
		if (chg > 0 && this.today.getFullYear() === this.year)	// no timesheets in the future
			return;
		this.year += chg;
		this.initTimesheet();
	};

	$scope.editTimesheet = function(idx) {
		this.isEditMode = true;
		$location.path("/editTimesheet/" + idx + "," + $scope.year);
	};

	$scope.save = function() {
		var qParam = $("form").serialize();
		$http.post("PutServlet?" + qParam).success(function () {
			$route.reload();
		}).error(function() {
			console.log("error in save()");
		});
	};
});
routeApp.factory('MyService', function ($http) {
	var promiseEmployees, promiseProjects, promiseFixedDates, promiseFixedDatesEmployees;
	var employees = [];
	var fixedDates = [];
	var fixedDatesEmployees = [];
	var me = {};
	var projects = [];
	var myService = {
		loadEmployees: function () {
//			if (!promiseEmployees) {
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
//			} else {
//				console.log("getting cached promiseEmployees");
//			}
			return promiseEmployees;
		},
		loadFixedDates: function () {
			if (!promiseFixedDates) {
				promiseFixedDates = $http.get('GetServlet?type=fixeddates').then(function (response) {
					console.log("fixedDates loaded over http");
					fixedDates = response.data;
				});
			} else {
				console.log("getting cached fixeddates");
			}
			return promiseFixedDates;
		},
		clearPromiseFixedDates: function() {	// don't cache, but reload the fixed dates
			promiseFixedDates = null;
		},
		loadFixedDatesEmployees: function (id) {
//			if (!promiseFixedDatesEmployees) {	//TODO fix. FAIL, wenn Reload ('Fixed Dates' -> 'Timesheets' -> 'Fixed Dates' -> Fehler)
				promiseFixedDatesEmployees = $http.get('GetServlet?type=fixeddates_employees&id=' + id).then(function(response) {
					console.log("fixedDatesEmployees loaded over http");
					fixedDatesEmployees = response.data;
				});
//			} else {
//				console.log("getting cached fixeddates_employees, len=" + fixedDatesEmployees.length);
//			}
			return promiseFixedDatesEmployees;
		},
		loadProjects: function () {
			if (!promiseProjects) {
				promiseProjects = $http.get('GetServlet?type=projects').then(function (response) {
					console.log("projects loaded over http");
					projects = response.data;
				});
			} else {
				console.log("getting cached promiseProjects");
			}
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
		},
		getFixedDatesEmployees: function () {
			for (var i = 0; i < fixedDatesEmployees.length; i++) {
				var fde = fixedDatesEmployees[i];
				fde.agreed = (fde === undefined) ? [] : fde.agreed.split(",");
				for (var j = 0; j < fde.agreed.length; j++) {
					if (fde.agreed[j] === "true")
						fde.agreed[j] = true;
					if (fde.agreed[j] === "false")
						fde.agreed[j] = false;
					if (fde.agreed[j] === "null")
						fde.agreed[j] = null;
				}
			}
			return fixedDatesEmployees;
		}
	};
	return myService;
});
//http://www.script-tutorials.com/pure-html5-file-upload/

// common variables
var iMaxFilesize = 1048576; // 1MB
var sResultFileSize = '';

function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB'];
	if (bytes === 0)
		return 'n/a';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

function fileSelected() {
	// hide different warnings
	document.getElementById('error').style.display = 'none';
	document.getElementById('error2').style.display = 'none';
	document.getElementById('abort').style.display = 'none';
	document.getElementById('warnsize').style.display = 'none';

	// get selected file element
	var oFile = document.getElementById('image_file').files[0];

	// filter for image files
	var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
	if (!rFilter.test(oFile.type)) {
		document.getElementById('error').style.display = 'block';
		return;
	}

	// little test for filesize
	if (oFile.size > iMaxFilesize) {
		document.getElementById('warnsize').style.display = 'block';
		return;
	}

	// get preview element
	var oImage = document.getElementById('preview');

	// prepare HTML5 FileReader
	var oReader = new FileReader();
	oReader.onload = function (e) {

		// e.target.result contains the DataURL which we will use as a source of the image
		oImage.src = e.target.result;

		oImage.onload = function () { // binding onload event
			sResultFileSize = bytesToSize(oFile.size);
			document.getElementById('fileinfo').style.display = 'block';
			document.getElementById('filename').innerHTML = 'Name: ' + oFile.name;
		};
	};

	// read selected file as DataURL
	oReader.readAsDataURL(oFile);
}

function startUploading() {
	// cleanup all temp states
	document.getElementById('error').style.display = 'none';
	document.getElementById('error2').style.display = 'none';
	document.getElementById('abort').style.display = 'none';
	document.getElementById('warnsize').style.display = 'none';

	// get image data for POSTing
	var vFD = new FormData();
	vFD.append('pictureFile', document.getElementById("image_file").files[0]);

	// create XMLHttpRequest object, adding few event listeners, and POSTing our data
	var oXHR = new XMLHttpRequest();
	oXHR.addEventListener('error', uploadError, false);
	oXHR.addEventListener('abort', uploadAbort, false);
	oXHR.open('POST', 'UploadServlet');
	oXHR.send(vFD);

	setImgSrc($('#tblPreview tbody img'));
}

function setImgSrc(img) {
	var file = $('#image_file').val();
	if (file.indexOf('\\') > -1)
		file = file.substring(file.lastIndexOf('\\')+1);
	$('#tblPreview tbody img').attr('src', 'images/' + file);
}

function uploadError(e) { // upload error
	document.getElementById('error2').style.display = 'block';
}

function uploadAbort(e) { // upload abort
	document.getElementById('abort').style.display = 'block';
}