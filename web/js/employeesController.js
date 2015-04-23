"use strict";
var myScope;
routeApp.controller('EmployeesController', function ($http, $routeParams, $location) {
	var ctrl = myScope = this;

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
	ctrl.isEditMode = false;

	var idParam = $routeParams.id ? '&id=' + $routeParams.id : '';
	$http.get('GetServlet?type=employees' + idParam).success(function (data) {
		ctrl.employees = data;
		ctrl.emp = ctrl.employees[0];
	}).error(function () {
		console.log("FAIL");
	});

	this.loadProjects = function () {
		console.log("loadProjects");
		$http.get('GetServlet?type=projects' + idParam).success(function (data) {
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

	this.addEmployee = function () {
		console.log("addEmployee");
		$http.post('PutServlet', JSON.stringify(ctrl.newEmployee)).success(function () {/*success callback*/
			$location.path("#team");
		});
	};

	this.redirect = function () {
	};

	this.delete = function () {
		//check, if ID in form is present
	};
}
);
