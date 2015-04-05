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
 * Deletes a single entry in the database<br>
 * http://localhost:8080/Triona_Angular/DeleteServlet?type=employees&id=14
 * http://localhost:8080/Triona_Angular/DeleteServlet?type=projects&id=9
 * http://localhost:8080/Triona_Angular/DeleteServlet?type=holidays&id=3
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
		switch (param) {
			case EMPLOYEES:
				out.println(service.deleteEmployee(getLongParam(req, ID)));
				break;
			case PROJECTS:
				out.println(service.deleteProject(getLongParam(req, ID)));
				break;
			case HOLIDAYS:
				out.println(service.deleteHoliday(getLongParam(req, ID)));
				break;
			default:
				String msg = "delete=" + param + " is not supported";
				LOG.log(Level.SEVERE, msg, param);
				out.println(msg);
		}
	}
}
