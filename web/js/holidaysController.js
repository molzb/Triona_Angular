var app = angular.module('TrionaModule', []);

app.controller('EmployeeController', ['$http', '$log', function($http, $log) {
		var ctrl = this;
		
		ctrl.employees = [];
		ctrl.projects = [];
		ctrl.holidays = [];

		ctrl.searchTerm = '';
		ctrl.orderBy = '';
		ctrl.newEmployee = {};

		this.hello = "World";

		$http.get('GetServlet?type=employees').success(function(data) {
			ctrl.employees = data;
		}).error(function() {
			console.log("FAIL");
		});

		this.search = function(searchT) {
			console.log(searchT);
			this.searchTerm = searchT;
		};

		this.addEmployee = function() {
			console.log("addEmployee");
		};
	}
]);
