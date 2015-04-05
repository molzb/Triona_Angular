package servlet;

import java.io.IOException;
import java.sql.Date;
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
import javax.sql.DataSource;
import persistence.DbService;

@WebServlet(name = "BaseServlet", urlPatterns = {"/BaseServlet"})
public class BaseServlet extends HttpServlet {

	private static final Logger LOG = Logger.getLogger(BaseServlet.class.getName());
	@Resource(mappedName = "jdbc/triona", name = "jdbc/triona")
	private DataSource ds;
	private final DateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
	protected static final String 
			TYPE = "type",
			EMPLOYEES = "employees",
			PROJECTS = "projects",
			HOLIDAYS = "holidays";
	protected static final String ID = "id";

	protected DbService service;

	protected void processRequest(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("text/plain;charset=UTF-8");
		resp.getWriter().println("Don't call me directly");
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

	protected int getIntParam(HttpServletRequest req, String intStr) {
		return Integer.parseInt(req.getParameter(intStr));
	}

	protected long getLongParam(HttpServletRequest req, String longStr) {
		return Long.parseLong(req.getParameter(longStr));
	}

	@Override
	public void init() throws ServletException {
		super.init();
		service = new DbService(ds);
	}

	// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
	/**
	 * Handles the HTTP <code>GET</code> method.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	/**
	 * Handles the HTTP <code>POST</code> method.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	/**
	 * Returns a short description of the servlet.
	 *
	 * @return a String containing servlet description
	 */
	@Override
	public String getServletInfo() {
		return "BaseServlet";
	}// </editor-fold>

}
