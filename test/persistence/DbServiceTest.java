package persistence;

import java.sql.Date;
import java.util.logging.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import org.junit.Test;

/**
 *
 * @author Bernhard
 */
public class DbServiceTest {
	private static final Logger LOG = Logger.getLogger(DbServiceTest.class.getName());
	private final int YEAR = 2015;
	private final String EMPLOYEE_ID = "4";
	private final int FIX_DATE_ID = 1;
	DbService instance;

	public DbServiceTest() {
		instance = new DbService(new MyDataSource());
	}

	@Test
	public void testGetUserId() throws Exception {
		System.out.println("getUserId");
		String email = "bernhard.molz@triona.de";
		int result = instance.getUserId(email);
		assertEquals(Integer.parseInt(EMPLOYEE_ID), result);
	}

	//@Test
	public void testInsertOrUpdateEmployee() throws Exception {
		System.out.println("insertOrUpdateEmployee");
		DbService.SQL_INSERT_UPDATE type = null;
		long id = 0L;
		String firstName = "";
		String lastName = "";
		long projectId = 0L;
		String jobtitle = "";
		String city = "";
		String image = "";
		String text = "";
		String email = "";
		String password = "";
		boolean expResult = false;
		boolean result = instance.insertOrUpdateEmployee(type, id, firstName, lastName, projectId, jobtitle, city, image, text, email, password);
		assertEquals(expResult, result);
		// TODO review the generated test code and remove the default call to fail.
		fail("The test case is a prototype.");
	}

	//@Test
	public void testInsertOrUpdateHoliday() throws Exception {
		System.out.println("insertOrUpdateHoliday");
		DbService.SQL_INSERT_UPDATE type = null;
		long id = 0L;
		long employeeId = 0L;
		Date from = null;
		Date to = null;
		int days = 0;
		
		boolean expResult = false;
		boolean result = instance.insertOrUpdateHoliday(type, id, employeeId, from, to, days);
		assertEquals(expResult, result);
		// TODO review the generated test code and remove the default call to fail.
		fail("The test case is a prototype.");
	}

	//@Test
	public void testInsertOrUpdateProject() throws Exception {
		System.out.println("insertOrUpdateProject");
		DbService.SQL_INSERT_UPDATE type = null;
		long id = 0L;
		String client = "";
		String projectName = "";
		String city = "";
		
		boolean expResult = false;
		boolean result = instance.insertOrUpdateProject(type, id, client, projectName, city);
		assertEquals(expResult, result);
		// TODO review the generated test code and remove the default call to fail.
		fail("The test case is a prototype.");
	}

	//@Test
	public void testInsertOrUpdateTimesheet() throws Exception {
		System.out.println("insertOrUpdateTimesheet");
		DbService.SQL_INSERT_UPDATE type = null;
		long id = 0L;
		long employeeId = 0L;
		long projectId = 0L;
		Date day = null;
		String from = "";
		String to = "";
		String pause = "";
		String duration = "";
		String comment = "";
		
		boolean expResult = false;
		boolean result = instance.insertOrUpdateTimesheet(type, id, employeeId, projectId, day, from, to, pause, duration, comment);
		assertEquals(expResult, result);
		// TODO review the generated test code and remove the default call to fail.
		fail("The test case is a prototype.");
	}

	@Test
	public void testGetEmployee() throws Exception {
		System.out.println("getEmployee(1)");
		String result = instance.getEmployee(EMPLOYEE_ID);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 1);
	}

	@Test
	public void testGetEmployees() throws Exception {
		System.out.println("getEmployees");
		String result = instance.getEmployees();
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 13);
	}

	@Test
	public void testGetProjects() throws Exception {
		System.out.println("getProjects");
		String result = instance.getProjects();
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 8);
	}

	@Test
	public void testGetHolidays() throws Exception {
		System.out.println("getHolidays");
		String result = instance.getHolidays(EMPLOYEE_ID);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		System.out.println("jsonArray holidays=" + jsonArray.size());
		assertTrue(result != null && jsonArray.size() > 1);
	}

	@Test
	public void testGetTimesheets() throws Exception {
		System.out.println("getTimesheets");
		String result = instance.getTimesheets(EMPLOYEE_ID, YEAR);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 132);
	}

	@Test
	public void testGetSpecialDays() throws Exception {
		System.out.println("getSpecialDays");
		String result = instance.getSpecialDays(YEAR);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 17);
	}

	@Test
	public void testGetFixedDate() throws Exception {
		System.out.println("getFixedDate");
		String result = instance.getFixedDate(1L);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		System.out.println("jsonArray fixed=" + jsonArray.size());
		assertTrue(result != null && jsonArray.size() == 1);
	}

	@Test
	public void testGetFixedDateEmployees() throws Exception {
		System.out.println("getFixedDateEmployees");
		String result = instance.getFixedDateEmployees(FIX_DATE_ID);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		System.out.println("jsonArray fixedDateEmp=" + jsonArray.size());
		assertTrue(result != null && jsonArray.size() == 14);
	}

	//@Test
	public void testDeleteEmployee() throws Exception {
		System.out.println("deleteEmployee");
		long id = 0L;
		
		boolean expResult = false;
		boolean result = instance.deleteEmployee(id);
		assertEquals(expResult, result);
		// TODO review the generated test code and remove the default call to fail.
		fail("The test case is a prototype.");
	}

	//@Test
	public void testDeleteProject() throws Exception {
		System.out.println("deleteProject");
		long id = 0L;
		
		boolean expResult = false;
		boolean result = instance.deleteProject(id);
		assertEquals(expResult, result);
		// TODO review the generated test code and remove the default call to fail.
		fail("The test case is a prototype.");
	}

	//@Test
	public void testDeleteHoliday() throws Exception {
		System.out.println("deleteHoliday");
		long id = 0L;
		
		boolean expResult = false;
		boolean result = instance.deleteHoliday(id);
		assertEquals(expResult, result);
		// TODO review the generated test code and remove the default call to fail.
		fail("The test case is a prototype.");
	}

	//@Test
	public void testDeleteTimesheet() throws Exception {
		System.out.println("deleteTimesheet");
		long id = 0L;
		
		boolean expResult = false;
		boolean result = instance.deleteTimesheet(id);
		assertEquals(expResult, result);
		// TODO review the generated test code and remove the default call to fail.
		fail("The test case is a prototype.");
	}

}
