<%@page import="servlet.BaseServlet"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="userIsManager"><%=request.isUserInRole("admin")%></c:set>

<!DOCTYPE html>
<html>
	<head>
		<title>Triona Project</title>

		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<link href="css/thirdParty.css"		rel="stylesheet" type="text/css">
		<link href="css/triona.css"			rel="stylesheet" type="text/css">
		<link href="images/favicon.gif"		rel="shortcut icon" type="image/x-icon" />

		<script type="text/javascript" src="js/thirdParty.js"></script>
		<c:if test="${pageContext.request.remoteHost == '127.0.0.1'}">
			<script type="text/javascript" src="js/routeApp.js"></script>
			<script type="text/javascript" src="js/MyService.js"></script>
			<script type="text/javascript" src="js/employeesController.js"></script>
			<script type="text/javascript" src="js/projectsController.js"></script>
			<script type="text/javascript" src="js/holidaysController.js"></script>
			<script type="text/javascript" src="js/timesheetsController.js"></script>
			<script type="text/javascript" src="js/fixedDateController.js"></script>
			<script type="text/javascript" src="js/fileupload.js"></script>
		</c:if>
		<c:if test="${pageContext.request.remoteHost != '127.0.0.1'}">
			<script type="text/javascript" src="js/own.js"></script>
		</c:if>
</head>
	<body id="trionaBody">
		<nav id="triona" class="navbar navbar-inverse navbar-fixed-top">
			<div class="container-fluid">
				<div class="navbar-header">
					<img src="images/logo_triona.png" alt="Triona"/>
				</div>
				<div id="navbar" class="navbar-collapse collapse">
					<ul class="nav navbar-nav navbar-right">
						<li><a id="hiUser">Hi, <span id="user"><%=new BaseServlet().getUsername(request)%></span>!</a></li>
						<li>
							<form class="navbar-form navbar-right">
								<input type="text" class="form-control" placeholder="Search...">
							</form>
						</li>
						<li><a href="#logout">Logout</a></li>
					</ul>
				</div>
			</div>
		</nav>

		<div class="container-fluid" data-ng-app="routeApp">
			<div class="row" data-ng-controller="RouteCtrl">
				<div class="col-sm-3 col-md-2 sidebar">
					<ul class="nav nav-sidebar">
						<li data-ng-class="classActive('/home')"><a href="#home">Home</a></li>
						<li data-ng-class="classActive('/team')">
							<a href="#team">The team</a>
							<c:if test="${userIsManager == 'true'}">
								<ul class="nav nav-sidebar l2">
									<li data-ng-class="classActive('/addEmployee')"><a href="#addEmployee">Add employee</a></li>
								</ul>
							</c:if>
						</li>
						<li data-ng-class="classActive('/projects')"><a href="#projects">Projects</a></li>
						<li data-ng-class="classActive('/holidays')"><a href="#holidays">Holidays</a></li>
						<li data-ng-class="classActive('/timesheets')"><a href="#timesheets">Timesheets</a></li>
						<li data-ng-class="classActive('/fixedDates')">
							<a href="#fixedDates">Fixed Dates</a>
							<ul class="nav nav-sidebar l2">
								<li data-ng-class="classActive('/editFixedDate/1')"><a href="#editFixedDate/1">Add date</a></li>
							</ul>
						</li>
					</ul>
				</div>
				<div id="contentPane" class="col-sm-9 col-md-10 main" data-ng-view>
					<h1 class="page-header">Content</h1>
				</div>
			</div>
		</div>
	</body>
</html>
