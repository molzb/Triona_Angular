<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Login to Triona Project</title>
		<style type="text/css"><%@ include file="css/login.css"%></style>
    </head>
    <body>
		<div class="col-md-offset-5 col-md-3 form-login">
			<h2>Triona Project</h2><br>
			<form method="post" action="j_security_check">
				<input type="text" name="j_username" placeholder="username" class="form-control"><br>
				<input type="password" name="j_password" placeholder="password" class="form-control"><br>
				<input class="btn btn-primary" type="submit" value="Login">
			</form>
		</div>
	</body>
</html>