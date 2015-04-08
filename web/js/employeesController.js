//var app = angular.module('TrionaModule', []);
"use strict";
routeApp.controller('EmployeesController', ['$http', '$log', function($http, $log) {
		var ctrl = this;
		
		ctrl.employees = [];
		ctrl.projects = [];
		ctrl.jobTitles = [
			{name: 'Junior-Consultant', id: 0},
			{name: 'Consultant', id: 1},
			{name: 'Lead Consultant', id: 2},
			{name: 'Senior Consultant', id: 3},
			{name: 'CEO', id: 4}];

		ctrl.searchTerm = '';
		ctrl.orderBy = '';
		ctrl.newEmployee = {};
		ctrl.emp = {};


		$http.get('GetServlet?type=employees').success(function(data) {
			ctrl.employees = data;
			ctrl.emp = ctrl.employees[0];
		}).error(function() {
			console.log("FAIL");
		});

//		$http.get('GetServlet?type=projects').success(function (data) {
//			ctrl.projects = data;
//		}).error(function () {
//			console.log("FAIL");
//		});

		this.getEmp = function(idx) {
			return employees[idx];
		};

		this.search = function(searchT) {
			console.log(searchT);
			this.searchTerm = searchT;
		};

		this.addEmployee = function() {
			console.log("addEmployee");
		};

		this.delete = function() {
			//check, if ID in form is present
		};
	}
]);
