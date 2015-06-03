"use strict";
routeApp.controller('ProjectsCtrl', function (MyService) {
	var ctrl = this;
	ctrl.projects = [];

	MyService.loadProjects().then(function (d) {
		ctrl.projects = MyService.getProjects();
	});
});
