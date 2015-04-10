<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Login to Triona Project</title>
		<style type="text/css">
			<jsp:include page="css/bootstrap.min.css"></jsp:include>
			html, body { height: 100%; }
			body { padding-top: 15%; }
			.form-login {
				background-color: #ededed;
				border-radius: 15px;
				border: 1px solid #888888;
				padding: 10px 20px 20px;
				text-align: center;
			}
		</style>
    </head>
    <body>
		<div class="col-md-offset-5 col-md-3 form-login">
			<h2>Triona Project</h2><br>
			<span class="text-danger">Login oder Passwort falsch!</span>
			<br><br>
			<a href="login.jsp" class="btn btn-primary">Zurück</a>
		</div>
	</body>
</html>
