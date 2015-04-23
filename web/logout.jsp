<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
	System.out.println("Log out " + request.getRemoteUser());
	session.invalidate();
%>
<script type="text/javascript">
	window.setTimeout(function() {
		window.location.href = "login.jsp";
	}, 2000);
</script>
<h1 style="text-align: center">You're logged out</h1>
