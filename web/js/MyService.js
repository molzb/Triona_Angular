routeApp.factory('MyService', function ($http) {
	var promiseEmployees, promiseProjects, promiseFixedDates, promiseFixedDatesEmployees;
	var employees = [];
	var fixedDates = [];
	var fixedDatesEmployees = [];
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
			} else {
				console.log("getting cached promiseEmployees");
			}
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
				fde.agreed = fde.agreed.split(",");
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
