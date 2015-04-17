package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Shows a table in the database as JSON
 * http://localhost:8080/Triona_Angular/GetServlet?type=employees
 * http://localhost:8080/Triona_Angular/GetServlet?type=employees&me=true
 * http://localhost:8080/Triona_Angular/GetServlet?type=employees&id=5
 * http://localhost:8080/Triona_Angular/GetServlet?type=holidays
 * http://localhost:8080/Triona_Angular/GetServlet?type=holidays&me=true
 * http://localhost:8080/Triona_Angular/GetServlet?type=projects
 *
 * @author Bernhard
 */
@WebServlet(name = "GetServlet", urlPatterns = {"/GetServlet"})
public class GetServlet extends BaseServlet {

	private static final Logger LOG = Logger.getLogger(GetServlet.class.getName());

	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		String param = request.getParameter(TYPE);
		String myId = String.valueOf(getUserId(request));
		boolean meAsId = getBooleanParam(request, ME);
		String id = request.getParameter(ID);
		switch (param) {
			case EMPLOYEES:
				out.println(meAsId ? service.getEmployeeAsJson(myId) : service.getEmployeeAsJson(id));
				break;
			case PROJECTS:
				out.println(service.getProjectsAsJson());
				break;
			case HOLIDAYS:
				out.println(meAsId ? service.getHolidaysAsJson(myId) : service.getHolidaysAsJson(null));
				break;
			default:
				String msg = "select=" + param + " is not supported";
				LOG.log(Level.SEVERE, msg, param);
				out.println(msg);
		}
	}
}
