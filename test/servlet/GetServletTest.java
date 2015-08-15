package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.simple.JSONArray;
import org.json.simple.JSONValue;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import persistence.DbService;
import persistence.MyDataSource;

/**
 *
 * @author Bernhard
 */
public class GetServletTest {

	private final HttpServletRequest req = mock(HttpServletRequest.class);
	private final HttpServletResponse resp = mock(HttpServletResponse.class);
	private final HttpSession sess = mock(HttpSession.class);
	GetServlet instance = new GetServlet();
	StringWriter sw;

	public GetServletTest() {
	}

	@Before
	public void before() throws IOException {
		when(req.getSession(true)).thenReturn(sess);
		sw = new StringWriter();
		when(resp.getWriter()).thenReturn(new PrintWriter(sw));
		when(sess.getAttribute("userId")).thenReturn(4);
	}

	@Test
	public void test_processRequestEmployee()
			throws ServletException, IOException {
		System.out.println("processRequest employee");
		when(req.getParameter(BaseServlet.TYPE)).thenReturn(BaseServlet.EMPLOYEES);
		when(req.getParameter(BaseServlet.ME)).thenReturn("true");
		instance = getGetServlet();
		String result = sw.getBuffer().toString();
		JSONArray jsonArray = (JSONArray)JSONValue.parse(result);
		assertTrue(jsonArray.size() == 1);
	}

	@Test
	public void test_processRequestEmployees()
			throws ServletException, IOException {
		System.out.println("processRequest " + BaseServlet.EMPLOYEES);
		when(req.getParameter(BaseServlet.TYPE)).thenReturn(BaseServlet.EMPLOYEES);
		instance = getGetServlet();
		String result = sw.getBuffer().toString();
		JSONArray jsonArray = (JSONArray) JSONValue.parse(result);
		assertTrue(jsonArray.size() == 13);
	}

	@Test
	public void test_processRequestProjects()
			throws ServletException, IOException {
		System.out.println("processRequest " + BaseServlet.PROJECTS);
		when(req.getParameter(BaseServlet.TYPE)).thenReturn(BaseServlet.PROJECTS);
		instance = getGetServlet();
		String content = sw.getBuffer().toString();
		JSONArray jsonArray = (JSONArray) JSONValue.parse(content);
		assertTrue(jsonArray.size() == 8);
	}

	@Test
	public void test_processRequestHolidays()
			throws ServletException, IOException {
		System.out.println("processRequest " + BaseServlet.HOLIDAYS);
		when(req.getParameter(BaseServlet.TYPE)).thenReturn(BaseServlet.HOLIDAYS);
		when(req.getParameter(BaseServlet.ME)).thenReturn("true");
		instance = getGetServlet();
		String result = sw.getBuffer().toString();
		JSONArray jsonArray = (JSONArray) JSONValue.parse(result);
		assertTrue(jsonArray.size() == 3);
	}

	@Test
	public void test_processRequestSpecialDays()
			throws ServletException, IOException {
		System.out.println("processRequest " + BaseServlet.SPECIALDAYS);
		when(req.getParameter(BaseServlet.TYPE)).thenReturn(BaseServlet.SPECIALDAYS);
		when(req.getParameter(BaseServlet.YEAR)).thenReturn("2015");
		instance = getGetServlet();
		String result = sw.getBuffer().toString();
		JSONArray jsonArray = (JSONArray) JSONValue.parse(result);
		assertTrue(jsonArray.size() == 17);
	}

	@Test
	public void test_processRequestTimesheets()
			throws ServletException, IOException {
		System.out.println("processRequest " + BaseServlet.TIMESHEETS);
		when(req.getParameter(BaseServlet.TYPE)).thenReturn(BaseServlet.TIMESHEETS);
		when(req.getParameter(BaseServlet.YEAR)).thenReturn("2015");
		when(req.getParameter(BaseServlet.ME)).thenReturn("true");
		instance = getGetServlet();
		String result = sw.getBuffer().toString();
		JSONArray jsonArray = (JSONArray) JSONValue.parse(result);
		assertTrue(jsonArray.size() == 132);
	}

	private GetServlet getGetServlet() throws ServletException, IOException {
		instance = new GetServlet();
		when(instance.getUserId(req)).thenReturn(4);
		instance.setDbService(new DbService(new MyDataSource()));
		instance.processRequest(req, resp);
		return instance;
	}
}
