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
 * Deletes a single entry in the database<br>
 * http://localhost:8080/Triona_Angular/DeleteServlet?type=employees&id=14
 * http://localhost:8080/Triona_Angular/DeleteServlet?type=projects&id=9
 * http://localhost:8080/Triona_Angular/DeleteServlet?type=holidays&id=3
 *
 * @author Bernhard
 */
@WebServlet(name = "DeleteServlet", urlPatterns = {"/DeleteServlet"})
public class DeleteServlet extends BaseServlet {

	private static final Logger LOG = Logger.getLogger(DeleteServlet.class.getName());

	protected void processRequest(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("text/plain;charset=UTF-8");
		PrintWriter out = resp.getWriter();
		String param = req.getParameter(TYPE);
		long id = getLongParam(req, ID);
		try {
			switch (param) {
				case EMPLOYEES:
					out.println(dbService.deleteEmployee(id));
					break;
				case PROJECTS:
					out.println(dbService.deleteProject(id));
					break;
				case HOLIDAYS:
					out.println(dbService.deleteHoliday(id));
					break;
				case TIMESHEETS:
					out.println(dbService.deleteTimesheet(id));
					break;
				default:
					String msg = "delete=" + param + " is not supported";
					LOG.log(Level.SEVERE, msg, param);
					out.println(escapeHTML(msg));
			}
		} catch (SQLException ex) {
			Logger.getLogger(DeleteServlet.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}
