package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import static persistence.DbService.SQL_INSERT_OR_UPDATE.*;

/**
 * Insert or update an entry in the database<br>
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=INSERT&type=employees&firstName=Hans&lastName=Dampf&projectId=1&city=Frankfurt&image=hd.jpg&text=...&email=hd@triona.de&password=geheim&jobtitle=consultant
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=UPDATE&type=employees&firstName=Hans&lastName=Sumpf&projectId=2&city=Frankfurt&image=hd.jpg&text=...&email=hs@triona.de&jobtitle=consultant&id=14
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=INSERT&type=projects&client=DB&projectName=test&city=Frankfurt
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=UPDATE&type=projects&client=BD&projectName=TEST&city=Darmstadt&id=9
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=INSERT&type=holidays&employeeId=1&fromDate=01.03.2015&toDate=03.03.2015&workingDays=3
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=UPDATE&type=holidays&employeeId=1&fromDate=01.03.2015&toDate=04.03.2015&workingDays=4&id=3
 * @author Bernhard
 */
@WebServlet(name = "PutServlet", urlPatterns = {"/PutServlet"})
public class PutServlet extends BaseServlet {

	private static final Logger LOG = Logger.getLogger(PutServlet.class.getName());

	protected void processRequest(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("text/plain;charset=UTF-8");
		PrintWriter out = resp.getWriter();
		String typeParam = req.getParameter(TYPE);
		String sqlTypeParam = req.getParameter("sqlType");
		boolean isInsert = sqlTypeParam.equals(INSERT.name());
		System.out.println("userName=" + getUsername(req) + ", userId=" + getUserId(req));

		switch (typeParam) {
			case EMPLOYEES:
				if (isInsert) {
					out.println(service.insertOrUpdateEmployee(INSERT, 0L,
							req.getParameter("firstName"),
							req.getParameter("lastName"),
							getLongParam(req, "projectId"),
							req.getParameter("jobtitle"),
							req.getParameter("city"),
							req.getParameter("image_file"),
							req.getParameter("text"),
							req.getParameter("email"),
							req.getParameter("password")));
				} else {
					out.println(service.insertOrUpdateEmployee(UPDATE,
							getUserId(req),
							req.getParameter("firstName"),
							req.getParameter("lastName"),
							getLongParam(req, "projectId"),
							req.getParameter("jobtitle"),
							req.getParameter("city"),
							req.getParameter("image_file"),
							req.getParameter("text"),
							req.getParameter("email"),
							null));
				}
				break;
			case PROJECTS:
				if (isInsert) {
					out.println(service.insertOrUpdateProject(INSERT, 0,
							req.getParameter("client"),
							req.getParameter("projectName"),
							req.getParameter("city")));
				} else {	// UPDATE
					out.println(service.insertOrUpdateProject(UPDATE,
							getLongParam(req, ID),
							req.getParameter("client"),
							req.getParameter("projectName"),
							req.getParameter("city")));
				}
				break;
			case HOLIDAYS:
				if (isInsert) {
					out.println(service.insertOrUpdateHoliday(INSERT, 0,
							getLongParam(req, "employeeId"),
							getDateParam(req, "fromDate"),
							getDateParam(req, "toDate"),
							getIntParam(req, "workingDays")));
				} else {
					out.println(service.insertOrUpdateHoliday(UPDATE,
							getLongParam(req, ID),
							getLongParam(req, "employeeId"),
							getDateParam(req, "fromDate"),
							getDateParam(req, "toDate"),
							getIntParam(req, "workingDays")));
				}
				break;
			default:
				String msg = "type=" + typeParam + " is not supported";
				LOG.log(Level.SEVERE, msg, typeParam);
				out.println(msg);
		}
	}
}
