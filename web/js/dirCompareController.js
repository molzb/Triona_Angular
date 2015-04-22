var dirCompareApp = angular.module('DirCompareApp', []);
var myScope;
dirCompareApp.controller('DirCompareController', function($scope, $http) {
	myScope = $scope;
	this.dirs = [];

	$http.get('DirCompareServlet?dir=todo').success(function (data) {
		$scope.dirs = data;
	}).error(function() {
		console.log("FAIL");
	});
});