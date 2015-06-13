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
import static persistence.DbService.SQL_INSERT_UPDATE.INSERT;
import static persistence.DbService.SQL_INSERT_UPDATE.UPDATE;

/**
 * Insert or update an entry in the database<br>
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=INSERT&type=employees&firstName=Hans&lastName=Dampf&projectId=1&city=Frankfurt&image=hd.jpg&text=...&email=hd@triona.de&password=geheim&jobtitle=consultant
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=UPDATE&type=employees&firstName=Hans&lastName=Sumpf&projectId=2&city=Frankfurt&image=hd.jpg&text=...&email=hs@triona.de&jobtitle=consultant&id=14
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=INSERT&type=projects&client=DB&projectName=test&city=Frankfurt
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=UPDATE&type=projects&client=BD&projectName=TEST&city=Darmstadt&id=9
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=INSERT&type=holidays&employeeId=1&fromDate=01.03.2015&toDate=03.03.2015&workingDays=3
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=UPDATE&type=holidays&employeeId=1&fromDate=01.03.2015&toDate=04.03.2015&workingDays=4&id=3
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=INSERT&type=timesheets&employeeId=1&projectId=1&day=01.03.2015&fromTime=09:00&toTime=18:00&pauseTime=0:30&duration=08:30&comment=Whatever
 * http://localhost:8080/Triona_Angular/PutServlet?sqlType=UPDATE&type=timesheets&employeeId=1&projectId=1&day=01.03.2015&fromTime=09:00&toTime=18:00&pauseTime=0:30&duration=08:30&comment=Whatever&id=3
 *
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
		boolean isInsert = INSERT.name().equals(sqlTypeParam);

		try {
			switch (typeParam) {
				case EMPLOYEES:
					String imageFile = req.getParameter("image_file");
					// Chrome gibt mir C:\fakepath\Picture.jpg zurück. Kürzen auf Picture.jpg
					String image = imageFile.contains("\\") ?
							imageFile.substring(imageFile.lastIndexOf('\\') + 1) : imageFile;
					if (isInsert) {
						out.println(dbService.insertOrUpdateEmployee(INSERT, 0,
								req.getParameter("firstName"),
								req.getParameter("lastName"),
								getIntParam(req, "projectId"),
								req.getParameter("jobtitle"),
								req.getParameter("city"),
								image,
								req.getParameter("text"),
								req.getParameter("email"),
								req.getParameter("password")));
					} else {
						out.println(dbService.insertOrUpdateEmployee(UPDATE,
								getUserId(req),
								req.getParameter("firstName"),
								req.getParameter("lastName"),
								getIntParam(req, "projectId"),
								req.getParameter("jobtitle"),
								req.getParameter("city"),
								image,
								req.getParameter("text"),
								req.getParameter("email"),
								null));
					}
					break;
				case PROJECTS:
					if (isInsert) {
						out.println(dbService.insertOrUpdateProject(INSERT, 0,
								req.getParameter("client"),
								req.getParameter("projectName"),
								req.getParameter("city")));
					} else {	// UPDATE
						out.println(dbService.insertOrUpdateProject(UPDATE,
								getIntParam(req, ID),
								req.getParameter("client"),
								req.getParameter("projectName"),
								req.getParameter("city")));
					}
					break;
				case HOLIDAYS:
					if (isInsert) {
						out.println(dbService.insertOrUpdateHoliday(INSERT, 0,
								getIntParam(req, "employeeId"),
								getDateParam(req, "fromDate"),
								getDateParam(req, "toDate"),
								getIntParam(req, "workingDays")));
					} else {
						out.println(dbService.insertOrUpdateHoliday(UPDATE,
								getIntParam(req, ID),
								getIntParam(req, "employeeId"),
								getDateParam(req, "fromDate"),
								getDateParam(req, "toDate"),
								getIntParam(req, "workingDays")));
					}
					break;
				case TIMESHEETS:
					for (int i = 1; i <= 31; i++) {
						if (req.getParameter("id" + i) == null)
							continue;
						String idTimesheet = req.getParameter("id" + i);
						if (req.getParameter("from" + i).isEmpty() || req.getParameter("to" + i).isEmpty())
							continue;

						dbService.insertOrUpdateTimesheet(idTimesheet.isEmpty() ? INSERT : UPDATE,
								idTimesheet.isEmpty() ? 0 : new Integer(idTimesheet),
								getIntParam(req, "employeeId"),
								getIntParam(req, "projectId"),
								getDateParam(req,"day" + i),
								req.getParameter("from" + i),
								req.getParameter("to" + i),
								req.getParameter("pause" + i),
								req.getParameter("duration" + i),
								req.getParameter("comment" + i));
					}
					break;
				case FIXEDDATES_EMPLOYEES:
					if (isInsert) {
						out.println(dbService.insertOrUpdateFixedDateEmp(INSERT, 0,
								getIntParam(req, "employeeId"),
								getBooleanParam(req, "agreed1"),
								getBooleanParam(req, "agreed2"),
								getBooleanParam(req, "agreed3"),
								getBooleanParam(req, "agreed4"),
								getBooleanParam(req, "agreed5"),
								getBooleanParam(req, "agreed6")));
					} else {
						System.out.println("eid=" + getIntParam(req, "employeeId"));
						out.println(dbService.insertOrUpdateFixedDateEmp(UPDATE,
								getIntParam(req, ID),
								getIntParam(req, "employeeId"),
								getBooleanParam(req, "agreed1"),
								getBooleanParam(req, "agreed2"),
								getBooleanParam(req, "agreed3"),
								getBooleanParam(req, "agreed4"),
								getBooleanParam(req, "agreed5"),
								getBooleanParam(req, "agreed6")));
					}
					break;

				default:
					String msg = "type=" + typeParam + " is not supported";
					LOG.log(Level.SEVERE, msg, typeParam);
					out.println(escapeHTML(msg));
			}
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, null, ex);
		}
	}
}
