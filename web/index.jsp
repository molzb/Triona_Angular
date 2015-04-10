<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<title>Triona Project</title>

		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<link href="css/template.css" rel="stylesheet" type="text/css">
		<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css">
		<link href="css/triona.css" rel="stylesheet" type="text/css">

		<script type="text/javascript" src="js/angular.js"></script>
		<script type="text/javascript" src="js/angular-route.js"></script>
		<script type="text/javascript" src="js/routeApp.js"></script>
		<script type="text/javascript" src="js/employeesController.js"></script>
		<script type="text/javascript" src="js/projectsController.js"></script>
		<script type="text/javascript" src="js/jquery.js"></script>

		<script type="text/javascript" src="js/moment-with-locales.js"></script>
		<script type="text/javascript" src="js/bootstrap-datetimepicker.js"></script>
		<script type="text/javascript" src="js/holidaysController.js"></script>

	</head>
	<body>
		<nav id="triona" class="navbar navbar-inverse navbar-fixed-top">
			<div class="container-fluid">
				<div class="navbar-header">
					<img src="images/logo_triona.png" alt="Triona"/>
				</div>
				<div id="navbar" class="navbar-collapse collapse">
					<ul class="nav navbar-nav navbar-right">
						<li><a style="color: white; font-weight: bold">Hallo, <%=request.getRemoteUser()%>!</a></li>
						<li>
							<form class="navbar-form navbar-right">
								<input type="text" class="form-control" placeholder="Search...">
							</form>
						</li>
						<li><a href="logout.jsp">Logout</a></li>
					</ul>
				</div>
			</div>
		</nav>

		<div class="container-fluid" ng-app="routeApp">
			<div class="row" ng-controller="RouteController">
				<div class="col-sm-3 col-md-2 sidebar">
					<ul class="nav nav-sidebar">
						<li ng-class="classActive('/home')"><a href="#home">Home</a></li>
						<li ng-class="classActive('/team')"><a href="#team">The team</a></li>
						<li ng-class="classActive('/projects')"><a href="#projects">Projects</a></li>
						<li ng-class="classActive('/holidays')"><a href="#holidays">Holidays</a></li>
					</ul>
				</div>
				<div id="contentPane" class="col-sm-9 col-md-10 main" ng-view>
					<h1 class="page-header">Dashboard</h1>
					<h1 class="page-header">Dashboard</h1>
					<h1 class="page-header">Dashboard</h1>
					<h1 class="page-header">Dashboard</h1>
					<h1 class="page-header">Dashboard</h1>
					<h1 class="page-header">Dashboard</h1>
					<h1 class="page-header">Dashboard</h1>
					<h1 class="page-header">Dashboard</h1>
				</div>
			</div>
		</div>
	</body>
</html>