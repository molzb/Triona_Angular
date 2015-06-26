"use strict";
var myFixedDateScope;
routeApp.controller('FixedDateCtrl', function ($scope, $route, $http, $routeParams, MyService) {
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
		$("form[name=frmFixedDate]").attr("action", "PutServlet").submit();
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
});