package servlet;

import java.io.IOException;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Time;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;
import persistence.DbService;

@WebServlet(name = "BaseServlet", urlPatterns = {"/BaseServlet"})
public class BaseServlet extends HttpServlet {

	private static final Logger LOG = Logger.getLogger(BaseServlet.class.getName());
	protected static final String TYPE = "type",
			EMPLOYEES = "employees",
			PROJECTS = "projects",
			HOLIDAYS = "holidays",
			SPECIALDAYS = "specialdays",
			TIMESHEETS = "timesheets",
			FIXEDDATES = "fixeddates",
			FIXEDDATES_EMPLOYEES = "fixeddates_employees",
			ME = "me",
			YEAR = "year",
			ID = "id";

	@Resource(mappedName = "jdbc/triona", name = "jdbc/triona")
	private DataSource ds;
	private final DateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
	private final DateFormat sdfTime = new SimpleDateFormat("HH:mm");
	protected DbService dbService;

	protected void processRequest(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("text/plain;charset=UTF-8");
		resp.getWriter().println("Don't call me directly");
	}

	public String getUsername(HttpServletRequest req) {
		return req.getRemoteUser() == null ? "bernhard.molz@triona.de" : req.getRemoteUser();
	}

	protected int getUserId(HttpServletRequest req) {
		HttpSession sess = req.getSession(true);
		if (sess.getAttribute("userId") == null) {
			try {
				sess.setAttribute("userId", dbService.getUserId(getUsername(req)));
			} catch (SQLException ex) {
				LOG.log(Level.SEVERE, null, ex);
			}
		}
		return (Integer) sess.getAttribute("userId");
	}

	protected Date getDateParam(HttpServletRequest req, String dateStr) {
		try {
			String datePrm = req.getParameter(dateStr);
			return new Date(sdf.parse(datePrm).getTime());
		} catch (ParseException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
		}
		return null;
	}

	protected Time getTimeParam(HttpServletRequest req, String timeStr) {
		try {
			String timePrm = req.getParameter(timeStr);
			return new Time(sdfTime.parse(timePrm).getTime());
		} catch (ParseException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
		}
		return null;
	}

	protected boolean getBooleanParam(HttpServletRequest req, String boolStr) {
		String boolPrm = req.getParameter(boolStr);
		if (boolPrm == null) {
			return false;
		}
		switch (boolPrm) {
			case "true":
				return true;
			case "false":
				return false;
			default:
				LOG.warning("boolStr =" + boolStr + " is undefined, return null");
				return false;
		}
	}

	protected int getIntParam(HttpServletRequest req, String intStr) {
		return Integer.parseInt(req.getParameter(intStr) == null ? "0" : req.getParameter(intStr));
	}

	protected long getLongParam(HttpServletRequest req, String longStr) {
		return Long.parseLong(req.getParameter(longStr));
	}

	@Override
	public void init() throws ServletException {
		super.init();
		dbService = new persistence.DbService(ds);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

//	http://stackoverflow.com/questions/1265282/recommended-method-for-escaping-html-in-java
	protected String escapeHTML(String s) {
		StringBuilder out = new StringBuilder(Math.max(16, s.length()));
		for (int i = 0; i < s.length(); i++) {
			char c = s.charAt(i);
			if (c > 127 || c == '"' || c == '<' || c == '>' || c == '&') {
				out.append("&#");
				out.append((int) c);
				out.append(';');
			} else {
				out.append(c);
			}
		}
		return out.toString();
	}

	@Override
	public String getServletInfo() {
		return "BaseServlet";
	}
}
