package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
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
		try {
			switch (param) {
				case EMPLOYEES:
					out.println(meAsId ? serviceUtils.getEmployeeAsJson(myId) : serviceUtils.getEmployeeAsJson(id));
					break;
				case PROJECTS:
					out.println(serviceUtils.getProjectsAsJson());
					break;
				case HOLIDAYS:
					out.println(meAsId ? serviceUtils.getHolidaysAsJson(myId) : serviceUtils.getHolidaysAsJson(null));
					break;
				case SPECIALDAYS:
					out.println(serviceUtils.getSpecialDaysAsJson());
					break;
				default:
					String msg = "select=%s is not supported".format(param);
					LOG.log(Level.SEVERE, msg, param);
					out.println(msg);
			}
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, null, ex);
		}
	}
}
