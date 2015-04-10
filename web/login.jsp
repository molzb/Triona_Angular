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
			<form method="post" action="j_security_check">
				<input type="text" name="j_username" placeholder="username" id="userName"
					   class="form-control input-sm">
				<br>
				<input type="password" name="j_password" placeholder="password" id="j_password"
					   class="form-control input-sm">
				<br>
				<input class="btn btn-primary" type="submit" value="Login">
			</form>
		</div>
	</body>
</html>
