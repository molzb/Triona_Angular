"use strict";
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
//		this.recalcTotals();
		return fromMins - toMins - pauseMins;
	};

	$scope.calcDiff = function(from, to, pause) {
		if (from === null || to === null || from === "" || to === "")
			return 0;
		var fromMins = convertHhmmToMinutes(from);
		var toMins = convertHhmmToMinutes(to);
		var pauseMins = convertHhmmToMinutes(pause);
		return fromMins - toMins - pauseMins - 480;
	};

	$scope.hasTimesheet = function(idx) {
		return $scope.timesheetMonthExists[idx];
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
