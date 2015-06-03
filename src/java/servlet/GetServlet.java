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
 * Shows a table in the database as JSON http://localhost:8080/Triona_Angular/GetServlet?type=employees
 * http://localhost:8080/Triona_Angular/GetServlet?type=employees&me=true
 * http://localhost:8080/Triona_Angular/GetServlet?type=employees&id=5
 *
 * http://localhost:8080/Triona_Angular/GetServlet?type=holidays
 * http://localhost:8080/Triona_Angular/GetServlet?type=holidays&me=true
 *
 * http://localhost:8080/Triona_Angular/GetServlet?type=projects
 *
 * http://localhost:8080/Triona_Angular/GetServlet?type=timesheets
 * http://localhost:8080/Triona_Angular/GetServlet?type=timesheets&me=true
 * http://localhost:8080/Triona_Angular/GetServlet?type=timesheets&id=5
 *
 * http://localhost:8080/Triona_Angular/GetServlet?type=fixeddates
 * http://localhost:8080/Triona_Angular/GetServlet?type=fixeddates&me=true
 * http://localhost:8080/Triona_Angular/GetServlet?type=fixeddates&id=5
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
		int year = getIntParam(request, YEAR);
		try {
			switch (param) {
				case EMPLOYEES:
					out.println(meAsId ? dbService.getEmployee(myId) : dbService.getEmployee(id));
					break;
				case PROJECTS:
					out.println(dbService.getProjects());
					break;
				case HOLIDAYS:
					out.println(meAsId ? dbService.getHolidays(myId) : dbService.getHolidays(null));
					break;
				case SPECIALDAYS:
					out.println(dbService.getSpecialDays(year));
					break;
				case TIMESHEETS:
					out.println(meAsId ? dbService.getTimesheets(myId, year) : dbService.getTimesheets(id, year));
					break;
				case FIXEDDATES:
					out.println(id != null ? dbService.getFixedDate(Long.valueOf(id)) : dbService.getFixedDate(null));
					break;
				case FIXEDDATES_EMPLOYEES:
					out.println(dbService.getFixedDateEmployees(id));
					break;
				default:
					String msg = "select=" + param + " is not supported";
					LOG.log(Level.SEVERE, msg, param);
					out.println(escapeHTML(msg));
			}
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, null, ex);
		}
	}
}
