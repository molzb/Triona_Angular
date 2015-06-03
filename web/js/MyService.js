routeApp.factory('MyService', function ($http) {
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
