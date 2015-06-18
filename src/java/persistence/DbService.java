package persistence;

import java.sql.Date;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.MapListHandler;
import org.apache.commons.dbutils.handlers.ScalarHandler;
import org.json.simple.JSONValue;
import static persistence.DbService.SQL_INSERT_UPDATE.UPDATE;

/**
 * Einfacher DB-Service mit CRUD-Methoden
 *
 * @author Bernhard
 */
public class DbService {

	private final DataSource ds;

	public enum SQL_INSERT_UPDATE {

		INSERT, UPDATE
	};

	public static void main(String[] args) throws SQLException {
		System.out.println(new DbService(new MyDataSource()).getLastInsertedId("employee"));
	}

	public DbService(DataSource ds) {
		this.ds = ds;
	}

	public int getUserId(String email) throws SQLException {
		String sql = "SELECT id FROM employee WHERE email = '" + email + "'";
		return new QueryRunner(ds).query(sql, new ScalarHandler<Integer>("id"));
	}

	public boolean insertOrUpdateEmployee(SQL_INSERT_UPDATE type,
			int id, String firstName, String lastName, long projectId, String jobtitle,
			String city, String image, String text, String email, String password) throws SQLException {
		String sqlInsert = "INSERT INTO employee (first_name, last_name, project_id, jobtitle, city, image, text, email, password) "
				+ "VALUES (?,?,?,?,?,  ?,?,?,sha(?))";
		String sqlUpdate = "UPDATE employee SET first_name=?, last_name=?, project_id=?, jobtitle=?, city=?, image=?, text=?, email=? "
				+ "WHERE id = ?";

		if (type == UPDATE) {
			return new QueryRunner(ds).update(sqlUpdate, firstName, lastName, projectId, jobtitle, city, image, text, email, id) > 0;
		} else //if (type == INSERT)
		{
			return new QueryRunner(ds).update(sqlInsert, firstName, lastName, projectId, jobtitle, city, image, text, email, password) > 0;
		}
	}

	public boolean insertOrUpdateHoliday(SQL_INSERT_UPDATE type, int id,
			int employeeId, Date from, Date to, int days) throws SQLException {
		String sqlInsert = "INSERT INTO holiday (employee_id, from_date, to_date, working_days) VALUES (?,?,?,?)";
		String sqlUpdate = "UPDATE holiday SET employee_id=?, from_date=?, to_date=?, working_days=? WHERE id=?";

		if (type == UPDATE) {
			return new QueryRunner(ds).update(sqlUpdate, employeeId, from, to, days, id) > 0;
		} else //if (type == INSERT)
		{
			return new QueryRunner(ds).update(sqlInsert, employeeId, from, to, days) > 0;
		}
	}

	public boolean insertOrUpdateProject(SQL_INSERT_UPDATE type, int id,
			String client, String projectName, String city) throws SQLException {
		String sqlInsert = "INSERT INTO project (client, project_name, city) VALUES (?,?,?)";
		String sqlUpdate = "UPDATE project SET client=?, project_name=?, city=? WHERE id=?";

		if (type == UPDATE) {
			return new QueryRunner(ds).update(sqlUpdate, client, projectName, city, id) > 0;
		} else //if (type == INSERT)
		{
			return new QueryRunner(ds).update(sqlInsert, client, projectName, city) > 0;
		}
	}

	public boolean insertOrUpdateTimesheet(SQL_INSERT_UPDATE type, int id, int employeeId, long projectId,
			Date day, String from, String to, String pause, String duration, String comment) throws SQLException {
		String sqlInsert = "INSERT INTO timesheet (id, employee_id, project_id, day, from_, to_, "
				+ "pause, duration, comment) VALUES (?,?,?,?,?,   ?,?,?,?)";
		String sqlUpdate = "UPDATE timesheet SET day=?, from_=?, to_=?, pause=?, duration=?, comment=? WHERE id=?";

		if (type == UPDATE) {
			return new QueryRunner(ds).update(sqlUpdate, day, from, to, pause, duration, comment, id) > 0;
		} else //if (type == INSERT)
		{
			return new QueryRunner(ds).update(sqlInsert, id, employeeId, projectId, day, from, to, pause, 
					duration, comment) > 0;
		}
	}

	public boolean insertOrUpdateFixedDateEmp(int id, int employeeId, boolean agreed1,
			boolean agreed2, boolean agreed3, boolean agreed4, boolean agreed5, boolean agreed6) throws SQLException {
		String sqlSelect = "SELECT COUNT(*) FROM fixed_date_employee "
				+ "WHERE fixed_date_id=" + id + " AND employee_id=" + employeeId;
		String sqlUpdate = "UPDATE fixed_date_employee SET agreed1=?, agreed2=?, agreed3=?, agreed4=?, agreed5=?, "
				+ "agreed6=? WHERE fixed_date_id=? and employee_id=?";
		String sqlInsert = "INSERT INTO fixed_date_employee(fixed_date_id, employee_id, "
				+ "agreed1, agreed2, agreed3, agreed4, agreed5, agreed6) VALUES (?,?,	?,?,?,?,?,?)";

		boolean rowExists = new QueryRunner(ds).query(sqlSelect, new ScalarHandler<Long>()) > 0L;
		if (rowExists) {	// UPDATE statment
			return new QueryRunner(ds).update(sqlUpdate, agreed1, agreed2, agreed3, agreed4, agreed5, agreed6,
					id, employeeId) > 0;
		} else //if (!rowExists) -> INSERT statement
		{
			return new QueryRunner(ds).update(sqlInsert,
					id, employeeId, agreed1, agreed2, agreed3, agreed4, agreed5, agreed6) > 0;
		}
	}

	public String getEmployee(Integer id) throws SQLException {
		return getEmployees(id);
	}

	public String getEmployees() throws SQLException {
		return getEmployees(null);
	}

	private String getEmployees(Integer id) throws SQLException {
		String sql = "SELECT e.id, e.image, e.first_name as firstName, e.last_name as lastName, "
				+ " CONCAT(e.first_name, ' ', e.last_name) as fullName, e.jobtitle, e.city, e.text, e.holidays,"
				+ "	e.role_name AS roleName, e.email, e.project_id AS projectId, p.client AS projectClient,"
				+ " p.project_name AS projectName, p.city AS projectCity"
				+ "		FROM employee e, project p"
				+ "		WHERE e.project_id = p.id";
		if (id != null) {
			sql += " AND e.id = " + id;
		}
		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public String getProjects() throws SQLException {
		String sql = "SELECT p.id, p.icon, p.client, p.project_name as projectName, p.city, "
				+ "group_concat(e.id) as empIds, group_concat(concat(e.first_name, ' ', e.last_name)) as empNames "
				+ "FROM project p "
				+ "INNER JOIN employee e on e.project_id = p.id "
				+ "GROUP BY p.project_name "
				+ "ORDER by p.project_name";
		List<Map<String, Object>> mapList = new QueryRunner(ds).query(sql, new MapListHandler());
		for (Map m : mapList) {
			String empIds = (String)m.get("empIds"), empNames = (String)m.get("empNames");
			List empIdList = Arrays.asList(empIds.split(","));
			List empNamesList = Arrays.asList(empNames.split(","));
			m.put("empIds", empIdList);
			m.put("empNames", empNamesList);
		}

		return JSONValue.toJSONString(mapList);
	}

	public String getHolidays(Integer employeeId) throws SQLException {
		String sql = "SELECT e.first_name, e.last_name, p.project_name, CAST(h.from_date AS char) AS 'from', h.id, "
				+ " CAST(to_date AS char) AS 'to', h.working_days AS workingDays "
				+ "		FROM employee e "
				+ "		INNER JOIN project p on e.project_id = p.id "
				+ "		LEFT JOIN holiday h on e.id = h.employee_id "
				+ (employeeId != null ? " WHERE e.id = " + employeeId : "")
				+ "	ORDER BY e.last_name ";

		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public String getTimesheets(Integer employeeId, int year) throws SQLException {
		String sql = "SELECT id, employee_id, CAST(day AS char) AS day, from_ AS 'from', to_ AS 'to', "
				+ "pause, duration, comment "
				+ "	FROM timesheet "
				+ "		WHERE day >= '%s-01-01' AND day <= '%s-12-31'"
				+ (employeeId != null ? " AND employee_id = " + employeeId : "")
				+ " ORDER BY day, employee_id";
		sql = sql.replace("%s", String.valueOf(year));

		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public String getSpecialDays(int year) throws SQLException {
		String sql = "SELECT CAST(day AS char) AS day, type, name FROM specialday "
				+ "WHERE day>='%s-01-01' AND day<='%s-12-31'".replace("%s", String.valueOf(year));
		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public String getFixedDate(Integer id) throws SQLException {
		String sql = "SELECT fixed_date.id, employee_id AS employeeId, image, title, "
				+ "DATE_FORMAT(suggested_date1, '%b %Y, %a %d, %H:%i') AS suggestedDate1, "
				+ "IF(suggested_date2 IS NULL, NULL, DATE_FORMAT(suggested_date2, '%b %Y, %a %d, %H:%i')) AS suggestedDate2, "
				+ "IF(suggested_date3 IS NULL, NULL, DATE_FORMAT(suggested_date3, '%b %Y, %a %d, %H:%i')) AS suggestedDate3, "
				+ "IF(suggested_date4 IS NULL, NULL, DATE_FORMAT(suggested_date4, '%b %Y, %a %d, %H:%i')) AS suggestedDate4, "
				+ "IF(suggested_date5 IS NULL, NULL, DATE_FORMAT(suggested_date5, '%b %Y, %a %d, %H:%i')) AS suggestedDate5, "
				+ "IF(suggested_date6 IS NULL, NULL, DATE_FORMAT(suggested_date6, '%b %Y, %a %d, %H:%i')) AS suggestedDate6, "
				+ "CAST(duration AS char) AS duration"
				+ "    FROM fixed_date "
				+ "INNER JOIN employee ON employee.id = employee_id";
		sql += (id != null ? " WHERE id=" + id : "");
		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public String getFixedDateEmployees(Integer id) throws SQLException {
		String sql = "SELECT fixed_date_id as fixedId, employee_id AS employeeId, CONCAT("
				+ " IF(ISNULL(agreed1), 'null', IF(agreed1, 'true', 'false')), ',', "
				+ " IF(ISNULL(agreed2), 'null', IF(agreed2, 'true', 'false')), ',', "
				+ " IF(ISNULL(agreed3), 'null', IF(agreed3, 'true', 'false')), ',',"
				+ "	IF(ISNULL(agreed4), 'null', IF(agreed4, 'true', 'false')), ',',"
				+ "	IF(ISNULL(agreed5), 'null', IF(agreed5, 'true', 'false')), ',',"
				+ "	IF(ISNULL(agreed6), 'null', IF(agreed6, 'true', 'false'))) AS agreed"
				+ "	  FROM fixed_date_employee WHERE fixed_date_id = " + id;
		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public boolean deleteEmployee(int id) throws SQLException {
		String sql = "DELETE FROM employee WHERE id = ?";
		return new QueryRunner(ds).update(sql, id) > 0;
	}

	public boolean deleteProject(int id) throws SQLException {
		String sql = "DELETE FROM project WHERE id = ?";
		return new QueryRunner(ds).update(sql, id) > 0;
	}

	public boolean deleteHoliday(int id) throws SQLException {
		String sql = "DELETE FROM holiday WHERE id = ?";
		return new QueryRunner(ds).update(sql, id) > 0;
	}

	public boolean deleteTimesheet(int id) throws SQLException {
		String sql = "DELETE FROM timesheet WHERE id = ?";
		return new QueryRunner(ds).update(sql, id) > 0;
	}

	// just for testing
	public int getLastInsertedId(String table) throws SQLException {
		String sql = "SELECT MAX(id) FROM " + table;
		List id = new QueryRunner(ds).query(sql, new MapListHandler());
		Object entry = ((Map)id.get(0)).get("MAX(id)");
		return (int)entry;
	}

}
