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
