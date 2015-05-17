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
	$scope.timesheetSumHours = "";
	$scope.timesheetSumDiff = "";

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
		var sumDiffMinutes = 0, sumMinutes = 0;
		$scope.timesheetSumDays = 0;

		// init daily entries with default data
		var d = new Date($scope.year, mthIndex, 1, 0,0,0,0);
		while (d.getMonth() === mthIndex) {
			var specialDay = getSpecialDay(d);
			var entry = {employee_id: $scope.me.id,
				jsDate:		d,
				jsDateClass:specialDay !== null ? "weekend" : "",
				isWorkingDay:specialDay === null,
				jsFrom:		null,
				jsTo:		null,
				jsPause:	null,
				jsDuration:	null,
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
				entry.jsFrom = convertTimeToJsDate(entry.from);
				entry.jsTo = convertTimeToJsDate(entry.to);
				entry.jsPause = convertTimeToJsDate(entry.pause);
				entry.jsDuration = convertTimeToJsDate(entry.duration);
				var jsDiffMinutes = (entry.jsDuration.getTime() - new Date(0,0,0, 8,0,0,0).getTime()) / 60000;
				entry.jsDiff = convertMinutesToHourStr(jsDiffMinutes);
				entry.isWorkingDay = jsDate.getDay() >= 1 && jsDate.getDay() <= 5;
				
				$scope.timesheetCurrentMonth[jsDate.getDate() - 1] = entry;

				// calculate months totals
				$scope.timesheetSumDays++;
				sumDiffMinutes += jsDiffMinutes;
				sumMinutes += entry.jsDuration.getHours() * 60 + entry.jsDuration.getMinutes();
			}
		}
		$scope.timesheetSumDiff = convertMinutesToHourStr(sumDiffMinutes);
		$scope.timesheetSumHours = convertToHourString(sumMinutes, true);
	};

	var getSpecialDay = function(jsDate) {
		if (jsDate.getDay() === 6 || jsDate.getDay() === 0)
			return {name: "Weekend"};
		for (var i = 0; i < $scope.specialDays.length; i++) {
			var spDay = convertDateToJsDate($scope.specialDays[i].day);
			if (jsDate.getMonth() === spDay.getMonth() && jsDate.getDate() === spDay.getDate())
				return $scope.specialDays[i];
		}
		return null;
	};

	/**
	 * Ex. 90 minutes -> 1:30, -90 -> -1:30, -60 -> 1:00,
	 * @param {Number} minutes signed or unsigned number of minutes
	 * @return {String} 01:30 or -0:45 or "" (when minutes == 0)
	 */
	var convertMinutesToHourStr = function(minutes) {
		if (minutes === 0)
			return "";
		var minutesStr = Math.abs(minutes) % 60 < 10 ? "0" + Math.abs(minutes) % 60 : Math.abs(minutes) % 60;
		var str = parseInt(Math.abs(minutes) / 60) + ":" + minutesStr;
		return minutes < 0 ? "-" + str : str;
	};

	var convertTimeToJsDate = function(time_hhmmss) {
		if (time_hhmmss === undefined || time_hhmmss === "")
			return null;
		var timeTokens = time_hhmmss.split(":");
		return new Date(0,0,0, timeTokens[0], timeTokens[1], timeTokens[2],0);
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
		$scope.workingHoursMonth = ["0","0","0","0","0","0", "0","0","0","0","0","0"], $scope.workingHoursYear = "0";
		$scope.timesheetMonthExists = [false,false,false,false,false,false,  false,false,false,false,false,false];
		var workingMinutesMonth  = [0,0,0,0,0,0, 0,0,0,0,0,0], workingMinutesYear = 0;
		var month = 0;

		for (var i = 0; i < timesheet.length; i++) {
			var dayInT = timesheet[i];
			var dayTokens = dayInT.day.split("-");
			month = dayTokens[1] - 1;
			var duration = parseInt(dayInT.duration.substr(0,2)) * 60 + parseInt(dayInT.duration.substr(3,5));
			$scope.workingDaysMonth[month]++;
			$scope.workingDaysYear++;
			workingMinutesMonth[month] += duration;
			workingMinutesYear += duration;
			$scope.timesheetMonthExists[month] = true;
		}

		$scope.workingHoursYear = convertToHourString(workingMinutesYear, false);

		for (var i = 0, worstIdx = 0, bestIdx = 0; i < month; i++) {
			$scope.workingHoursMonth[i] = convertToHourString(workingMinutesMonth[i], false);
			
			if ($scope.workingDaysMonth[i] > $scope.workingDaysMonth[bestIdx]) {
				$scope.bestWorkingMonth = i;
				bestIdx = i;
			}
			if ($scope.workingDaysMonth[i] < $scope.workingDaysMonth[worstIdx]) {
				$scope.worstWorkingMonth = i;
				worstIdx = i;
			}
		}
	};

	$scope.hasTimesheet = function(idx) {
		return $scope.timesheetMonthExists[idx];
	};

	var convertToHourString = function(min, alwaysShowMinutes) {
		var hours = Math.floor(min / 60);
		var minutes = min % 60;
		if (minutes === 0 && !alwaysShowMinutes)
			return hours;
		return hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
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
		console.log($scope.from + "-" + $scope.to + ":" + $scope.workingDays);
		var qParam = "?sqlType={0}&type={1}&employeeId={2}&fromDate={3}&toDate={4}&workingDays={5}".
				format("INSERT", "timesheet", $scope.me.id, $scope.from, $scope.to, $scope.workingDays);
		$http.get("PutServlet" + qParam).success(function () {
			$route.reload();
		}).error(function() {
			console.log("error in save()");
		});
	};
});
