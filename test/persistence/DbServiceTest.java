package persistence;

import java.sql.Date;
import java.sql.SQLException;
import java.util.logging.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import static persistence.DbService.SQL_INSERT_UPDATE.INSERT;
import static persistence.DbService.SQL_INSERT_UPDATE.UPDATE;

/**
 *
 * @author Bernhard
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class DbServiceTest {
	private static final Logger LOG = Logger.getLogger(DbServiceTest.class.getName());
	private static final int YEAR = 2015;
	private static final Integer EMPLOYEE_ID = 4;
	private static final int FIX_DATE_ID = 1;
	private static final int PROJECT_ID = 1;
	private static final int YEAR_DATE = 199;
	DbService instance;

	public DbServiceTest() {
		instance = new DbService(new MyDataSource());
	}

	@Test
	public void t01TestGetUserId() throws SQLException {
		LOG.info("getUserId");
		String email = "bernhard.molz@triona.de";
		Integer result = instance.getUserId(email);
		assertEquals(EMPLOYEE_ID, result);
	}

	@Test
	public void t02TestGetEmployee() throws Exception {
		LOG.info("getEmployee(1)");
		String result = instance.getEmployee(EMPLOYEE_ID);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 1);
	}

	@Test
	public void t03TestGetEmployees() throws Exception {
		LOG.info("getEmployees");
		String result = instance.getEmployees();
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(jsonArray.size() == 13);
	}

	@Test
	public void t04TestGetProjects() throws Exception {
		LOG.info("getProjects");
		String result = instance.getProjects();
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 8);
	}

	@Test
	public void t05TestGetHolidays() throws Exception {
		LOG.info("getHolidays");
		String result = instance.getHolidays(EMPLOYEE_ID);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		LOG.info("jsonArray holidays=" + jsonArray.size());
		assertTrue(result != null && jsonArray.size() == 3);
	}

	@Test
	public void t06TestGetTimesheets() throws Exception {
		LOG.info("getTimesheets");
		String result = instance.getTimesheets(EMPLOYEE_ID, YEAR);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 132);
	}

	@Test
	public void t07TestGetSpecialDays() throws Exception {
		LOG.info("getSpecialDays");
		String result = instance.getSpecialDays(YEAR);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		assertTrue(result != null && jsonArray.size() == 17);
	}

	@Test
	public void t08TestGetFixedDate() throws Exception {
		LOG.info("getFixedDate");
		String result = instance.getFixedDate(1);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		LOG.info("jsonArray fixed=" + jsonArray.size());
		assertTrue(result != null && jsonArray.size() == 1);
	}

	@Test
	public void t09TestGetFixedDateEmployees() throws Exception {
		LOG.info("getFixedDateEmployees");
		String result = instance.getFixedDateEmployees(FIX_DATE_ID);
		JSONArray jsonArray = (JSONArray)JSONValue.parseWithException(result);
		LOG.info("jsonArray fixedDateEmp=" + jsonArray.size());
		assertTrue(result != null && jsonArray.size() == 14);
	}

	@Test
	public void t20TestInsertOrUpdateEmployee() throws Exception {
		LOG.info("insertOrUpdateEmployee INSERT");
		DbService.SQL_INSERT_UPDATE type = INSERT;
		int id = EMPLOYEE_ID;
		String firstName = "TestMister";
		String lastName = "Bean";
		long projectId = PROJECT_ID;
		String jobtitle = "Consultant";
		String city = "London";
		String image = "test.jpg";
		String text = "text bla bla";
		String email = "misterbean@triona.de";
		String password = "secret";
		boolean result = instance.insertOrUpdateEmployee(type, id, firstName, lastName, projectId,
				jobtitle, city, image, text, email, password);
		assertTrue(result);
	}

	@Test
	@SuppressWarnings("deprecation")
	public void t21TestInsertOrUpdateHoliday() throws Exception {
		LOG.info("insertOrUpdateHoliday INSERT");
		DbService.SQL_INSERT_UPDATE type = INSERT;
		Integer id = 0;
		int employeeId = EMPLOYEE_ID;
		Date from = new Date(YEAR_DATE, 11, 1);
		Date to = new Date(YEAR_DATE, 11, 4);
		int days = 4;
		boolean result = instance.insertOrUpdateHoliday(type, id, employeeId, from, to, days);
		assertTrue(result);
	}

	@Test
	public void t22TestInsertOrUpdateProject() throws Exception {
		LOG.info("insertOrUpdateProject INSERT");
		DbService.SQL_INSERT_UPDATE type = null;
		Integer id = 0;
		String client = "Test Deutsche Bahn";
		String projectName = "Neues Bahn-Projekt";
		String city = "Frankfurt";
		
		boolean result = instance.insertOrUpdateProject(type, id, client, projectName, city);
		assertTrue(result);
	}

	@Test
	public void t23TestInsertOrUpdateTimesheet() throws Exception {
		LOG.info("insertOrUpdateTimesheet INSERT");
		DbService.SQL_INSERT_UPDATE type = INSERT;
		Integer id = 0;
		Integer employeeId = EMPLOYEE_ID;
		Integer projectId = PROJECT_ID;
		@SuppressWarnings("deprecation")
		Date day = new Date(YEAR_DATE, 11, 1);
		String from = "08:00";
		String to = "17:00";
		String pause = "1:00";
		String duration = "8:00";
		String comment = "testComment";
		
		boolean result = instance.insertOrUpdateTimesheet(type, id, employeeId, projectId,
				day, from, to, pause, duration, comment);
		assertTrue(result);
	}

	@Test
	public void t30TestInsertOrUpdateEmployee() throws Exception {
		LOG.info("insertOrUpdateEmployee UPDATE");
		DbService.SQL_INSERT_UPDATE type = UPDATE;
		int id = instance.getLastInsertedId("employee");
		String firstName = "UpdateTestMister";
		String lastName = "UpdateBean";
		long projectId = PROJECT_ID;
		String jobtitle = "UpdateConsultant";
		String city = "UpdateLondon";
		String image = "update test.jpg";
		String text = "Update text bla bla";
		String email = "updatemisterbean@triona.de";
		String password = "secret";
		boolean result = instance.insertOrUpdateEmployee(type, id, firstName, lastName, projectId,
				jobtitle, city, image, text, email, password);
		assertTrue(result);
	}

	@Test
	@SuppressWarnings("deprecation")
	public void t31TestInsertOrUpdateHoliday() throws Exception {
		LOG.info("insertOrUpdateHoliday UPDATE");
		DbService.SQL_INSERT_UPDATE type = UPDATE;
		Integer id = instance.getLastInsertedId("holiday");
		int employeeId = EMPLOYEE_ID;
		Date from = new Date(YEAR_DATE, 11, 30);
		Date to = new Date(YEAR_DATE, 11, 31);
		int days = 2;
		boolean result = instance.insertOrUpdateHoliday(type, id, employeeId, from, to, days);
		assertTrue(result);
	}

	@Test
	public void t32TestInsertOrUpdateProject() throws Exception {
		LOG.info("insertOrUpdateProject UPDATE");
		DbService.SQL_INSERT_UPDATE type = UPDATE;
		Integer id = instance.getLastInsertedId("project");
		String client = "Update Test Deutsche Bahn";
		String projectName = "Update Neues Bahn-Projekt";
		String city = "Frankfurt";

		boolean result = instance.insertOrUpdateProject(type, id, client, projectName, city);
		assertTrue(result);
	}

	@Test
	public void t33TestInsertOrUpdateTimesheet() throws Exception {
		LOG.info("insertOrUpdateTimesheet UPDATE");
		DbService.SQL_INSERT_UPDATE type = UPDATE;
		int id = instance.getLastInsertedId("timesheet");
		int employeeId = EMPLOYEE_ID;
		int projectId = PROJECT_ID;
		@SuppressWarnings("deprecation")
		Date day = new Date(YEAR_DATE, 11, 1);
		String from = "08:00";
		String to = "23:59";
		String pause = "1:00";
		String duration = "14:59";
		String comment = "update testComment";

		boolean result = instance.insertOrUpdateTimesheet(type, id, employeeId, projectId,
				day, from, to, pause, duration, comment);
		assertTrue(result);
	}

	@Test
	public void t40TestDeleteEmployee() throws Exception {
		LOG.info("deleteEmployee");
		int id = instance.getLastInsertedId("employee");
		boolean result = instance.deleteEmployee(id);
		assertTrue(result);
	}

	@Test
	public void t41TestDeleteProject() throws Exception {
		LOG.info("deleteProject");
		int id = instance.getLastInsertedId("project");
		boolean result = instance.deleteProject(id);
		assertTrue(result);
	}

	@Test
	public void t42TestDeleteHoliday() throws Exception {
		LOG.info("deleteHoliday");
		int id = instance.getLastInsertedId("holiday");
		boolean result = instance.deleteHoliday(id);
		assertTrue(result);
	}

	@Test
	public void t43TestDeleteTimesheet() throws Exception {
		LOG.info("deleteTimesheet");
		int id = instance.getLastInsertedId("timesheet");
		boolean result = instance.deleteTimesheet(id);
		assertTrue(result);
	}
}
