<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
	session.invalidate();
%>
<!DOCTYPE html>
<html>
    <head>
        <title>Logout</title>
		<meta http-equiv="refresh" content="2;URL=login.jsp" />
    </head>
    <body>
		<h1 style="text-align: center">You're logged out</h1>
	</body>
</html>
