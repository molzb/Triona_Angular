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

	public DbService(DataSource ds) {
		this.ds = ds;
	}

	public int getUserId(String email) throws SQLException {
		String sql = "SELECT id FROM employee WHERE email = '" + email + "'";
		return new QueryRunner(ds).query(sql, new ScalarHandler<Integer>("id"));
	}

	public boolean insertOrUpdateEmployee(SQL_INSERT_UPDATE type,
			long id, String firstName, String lastName, long projectId, String jobTitle,
			String city, String image, String text, String email, String password) throws SQLException {
		String sqlInsert = "INSERT INTO employee (first_name, last_name, project_id, jobtitle, city, image, text, email, password) "
				+ "VALUES (?,?,?,?,?,  ?,?,?,sha(?))";
		String sqlUpdate = "UPDATE employee SET first_name=?, last_name=?, project_id=?, jobtitle=?, city=?, image=?, text=?, email=? "
				+ "WHERE id = ?";

		if (type == UPDATE) {
			return new QueryRunner(ds).update(sqlUpdate, firstName, lastName, projectId, jobTitle, city, image, text, email, id) > 0;
		} else //if (type == INSERT)
		{
			return new QueryRunner(ds).update(sqlInsert, firstName, lastName, projectId, jobTitle, city, image, text, email, password) > 0;
		}
	}

	public boolean insertOrUpdateHoliday(SQL_INSERT_UPDATE type, long id,
			long employeeId, Date from, Date to, int days) throws SQLException {
		String sqlInsert = "INSERT INTO holiday (employee_id, from_date, to_date, working_days) VALUES (?,?,?,?)";
		String sqlUpdate = "UPDATE holiday SET employee_id=?, from_date=?, to_date=?, working_days=? WHERE id=?";

		if (type == UPDATE) {
			return new QueryRunner(ds).update(sqlUpdate, employeeId, from, to, days, id) > 0;
		} else //if (type == INSERT)
		{
			return new QueryRunner(ds).update(sqlInsert, employeeId, from, to, days) > 0;
		}
	}

	public boolean insertOrUpdateProject(SQL_INSERT_UPDATE type, long id,
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

	public String getEmployeeAsJson(String id) throws SQLException {
		return getEmployeesAsJson(id);
	}

	public String getEmployeesAsJson() throws SQLException {
		return getEmployeesAsJson(null);
	}

	private String getEmployeesAsJson(String id) throws SQLException {
		String sql = "SELECT e.id, e.image, e.first_name as firstName, e.last_name as lastName, "
				+ " CONCAT(e.first_name, ' ', e.last_name) as fullName, e.jobtitle as jobTitle, e.city, e.text, e.holidays,"
				+ "	e.role_name AS roleName, e.email, e.project_id AS projectId, p.project_name AS projectName, p.city AS projectCity"
				+ "		FROM employee e, project p"
				+ "		WHERE e.project_id = p.id";
		if (id != null && !id.isEmpty()) {
			sql += " AND e.id = " + id;
		}
		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public String getProjectsAsJson() throws SQLException {
		String sql = "SELECT p.id, p.icon, p.client, p.project_name, p.city, "
				+ "group_concat(e.id) as empIds, group_concat(concat(e.first_name, ' ', e.last_name)) as empNames "
				+ "FROM project p "
				+ "INNER JOIN employee e on e.project_id = p.id "
				+ "GROUP BY p.project_name "
				+ "ORDER by p.project_name";
		List<Map<String, Object>> mapList = new QueryRunner(ds).query(sql, new MapListHandler());
		for (Map m : mapList) {
			List empIdList = Arrays.asList(m.get("empIds"));
			List empNamesList = Arrays.asList(m.get("empNames"));
			m.put("empIds", empIdList);
			m.put("empNames", empNamesList);
		}

		return JSONValue.toJSONString(mapList);
	}

	public String getHolidaysAsJson(String employeeId) throws SQLException {
		String sql = "SELECT e.first_name, e.last_name, p.project_name, CAST(h.from_date AS char) AS 'from', h.id, "
				+ " CAST(to_date AS char) AS 'to', h.working_days AS workingDays "
				+ "		FROM employee e "
				+ "		INNER JOIN project p on e.project_id = p.id "
				+ "		LEFT JOIN holiday h on e.id = h.employee_id "
				+ (employeeId != null && !employeeId.isEmpty() ? " WHERE e.id = " + employeeId : "")
				+ "	ORDER BY e.last_name ";

		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public String getSpecialDaysAsJson() throws SQLException {
		String sql = "SELECT CAST(day AS char) AS day, type FROM specialday";
		List mapList = (List) new QueryRunner(ds).query(sql, new MapListHandler());
		return JSONValue.toJSONString(mapList);
	}

	public boolean deleteEmployee(long id) throws SQLException {
		String sql = "DELETE FROM employee WHERE id = ?";
		return new QueryRunner(ds).update(sql, id) > 0;
	}

	public boolean deleteProject(long id) throws SQLException {
		String sql = "DELETE FROM project WHERE id = ?";
		return new QueryRunner(ds).update(sql, id) > 0;
	}

	public boolean deleteHoliday(long id) throws SQLException {
		String sql = "DELETE FROM holiday WHERE id = ?";
		return new QueryRunner(ds).update(sql, id) > 0;
	}
}
