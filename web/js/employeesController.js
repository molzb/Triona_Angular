"use strict";
var myScope;
routeApp.controller('EmployeesController', function ($http, $routeParams, $route, $location) {
	var ctrl = myScope = this;
	ctrl.myLocation = $location;

	ctrl.employees = [];
	ctrl.projects = [];
	ctrl.jobtitles = [
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

	//sorting
	ctrl.sortNameAsc = true, ctrl.sortCityAsc = true, ctrl.sortProjectAsc = true;
	ctrl.predicate = 'id';
	ctrl.reverse = false;

	ctrl.idParam = $routeParams.id ? '&id=' + $routeParams.id : '';
	console.log("param id=" + $routeParams.id);

	$http.get('GetServlet?type=employees' + ctrl.idParam).success(function (data) {
		ctrl.employees = data;
		ctrl.emp = ctrl.findEmp($('#user').text());
		if ($routeParams.id !== undefined) {
			ctrl.newEmployee = data[0];
			ctrl.isEditMode = true;
		}

		window.setTimeout(function () {
			$(".glyphicon").tooltip();
		}, 1000);
	}).error(function () {
		console.log("FAIL");
	});

	this.sortCol = function(pred) {
		ctrl.predicate = pred;
		switch (pred) {
			case "lastName":	ctrl.sortNameAsc = !ctrl.sortNameAsc;		break;
			case "city":		ctrl.sortCityAsc = !ctrl.sortCityAsc;		break;
			case "projectName": ctrl.sortProjectAsc = !ctrl.sortProjectAsc; break;
		}
		ctrl.reverse=!ctrl.reverse;
		return false;
	};

	this.sortNameClass = function() {
		return "sort glyphicon glyphicon-sort-by-alphabet" + (ctrl.sortNameAsc ? "" : "-alt");
	};

	this.sortProjectClass = function() {
		return "sort glyphicon glyphicon-sort-by-alphabet" + (ctrl.sortProjectAsc ? "" : "-alt");
	};

	this.sortCityClass = function() {
		return "sort glyphicon glyphicon-sort-by-alphabet" + (ctrl.sortCityAsc ? "" : "-alt");
	};
	this.findEmp = function (email) {
		for (var i = 0; i < ctrl.employees.length; i++) {
			if (ctrl.employees[i].email === email)
				return ctrl.employees[i];
		}
		return ctrl.employees[0];
	};

	this.loadProjects = function () {
		console.log("loadProjects");
		$http.get('GetServlet?type=projects' + ctrl.idParam).success(function (data) {
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

	this.addEmployee = function (e) {
		console.log("addEmployee");
		var qParam = "?sqlType={0}&type={1}&firstName={2}&lastName={3}&email={4}&jobtitle={5}&city={6}&projectId={7}&text={8}&image_file={9}".
				format("INSERT", "employees", e.firstName, e.lastName, e.email, e.jobtitle, e.city, 
					e.projectId, e.text, $("#image_file").val());
		$http.get('PutServlet' + qParam).success(function () {
			$location.path("/team");
		}).error(function() {
			console.log("error in addEmployee");
		});
	};

	this.findProject = function (id) {
		if (id === undefined || id === null)
			return "";
		console.log("find " + id + ", type=" + (typeof id));
		for (var i = 0; i < ctrl.projects.length; i++) {
			if (ctrl.projects[i].id === parseInt(id)) {
				return ctrl.projects[i].projectName + ", " + ctrl.projects[i].city;
			}
		}
		return "";
	};

	this.delete = function (id) {
		if (window.confirm("Do you really want to delete?")) {
			$http.post('DeleteServlet?type=employees&id=' + id).success(function (data) {
				$route.reload();
			}).error(function() {
				console.log("error in delete");
			});
		}
	};

	this.edit = function (id) {
		$location.path("/editEmployee/" + id);
	};
});
