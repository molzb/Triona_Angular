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
