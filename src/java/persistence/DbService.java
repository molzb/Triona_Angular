package persistence;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.DataSource;
import org.json.simple.JSONValue;
import static persistence.DbService.SQL_INSERT_OR_UPDATE.*;

/**
 * Einfacher DB-Service mit CRUD-Methoden
 *
 * @author Bernhard
 */
public class DbService {

	private static final Logger LOG = Logger.getLogger(DbService.class.getName());
	private final DataSource ds;
	private Connection conn;
	private Statement stmt;
	private PreparedStatement pstmt;

	public enum SQL_INSERT_OR_UPDATE {
		INSERT, UPDATE
	};

	public DbService(DataSource ds) {
		this.ds = ds;
	}

	public boolean insertOrUpdateEmployee(SQL_INSERT_OR_UPDATE type,
			long id, String firstName, String lastName, long projectId, String jobTitle,
			String city, String image, String text, String email, String password) {
		String sqlInsert = "INSERT INTO employee (first_name, last_name, project_id, jobtitle, city, image, text, email, password) "
				+ "VALUES (?,?,?,?,?,  ?,?,?,sha2(?,256))";
		String sqlUpdate = "UPDATE employee SET first_name=?, last_name=?, project_id=?, jobtitle=?, city=?, image=?, text=?, email=? "
				+ "WHERE id = ?";
		try {
			conn = ds.getConnection();
			pstmt = conn.prepareStatement(type == INSERT ? sqlInsert : sqlUpdate);
			pstmt.setString(1, firstName);
			pstmt.setString(2, lastName);
			pstmt.setLong(3, projectId);
			pstmt.setString(4, jobTitle);
			pstmt.setString(5, city);
			pstmt.setString(6, image);
			pstmt.setString(7, text);
			pstmt.setString(8, email);
			if (type == INSERT) {
				pstmt.setString(9, password);
			} else {	// UPDATE
				pstmt.setLong(9, id);
			}
			return pstmt.executeUpdate() > 0;
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			return false;
		} finally {
			DbUtil.closeQuietly(conn, pstmt, null);
		}
	}

	public boolean insertOrUpdateHoliday(SQL_INSERT_OR_UPDATE type, long id,
			long employeeId, Date from, Date to, int days) {
		String sqlInsert = "INSERT INTO holiday (employee_id, from_date, to_date, working_days) VALUES (?,?,?,?)";
		String sqlUpdate = "UPDATE holiday SET employee_id=?, from_date=?, to_date=?, working_days=? WHERE id=?";
		try {
			conn = ds.getConnection();
			pstmt = conn.prepareStatement(type == INSERT ? sqlInsert : sqlUpdate);
			pstmt.setLong(1, employeeId);
			pstmt.setDate(2, from);
			pstmt.setDate(3, to);
			pstmt.setLong(4, days);
			if (type == UPDATE) {
				pstmt.setLong(5, id);
			}
			return pstmt.executeUpdate() > 0;
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			return false;
		} finally {
			DbUtil.closeQuietly(conn, pstmt, null);
		}
	}

	public boolean insertOrUpdateProject(SQL_INSERT_OR_UPDATE type, long id, 
			String client, String projectName, String city) {
		String sqlInsert = "INSERT INTO project (client, project_name, city) VALUES (?,?,?)";
		String sqlUpdate = "UPDATE project SET client=?, project_name=?, city=? WHERE id=?";
		try {
			conn = ds.getConnection();
			pstmt = conn.prepareStatement(type == INSERT ? sqlInsert : sqlUpdate);
			pstmt.setString(1, client);
			pstmt.setString(2, projectName);
			pstmt.setString(3, city);
			if (type == UPDATE) {
				pstmt.setLong(4, id);
			}
			return pstmt.executeUpdate() > 0;
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			return false;
		} finally {
			DbUtil.closeQuietly(conn, pstmt, null);
		}
	}

	public String getEmployeeAsJson(String id) {
		Calendar cal = new GregorianCalendar();
		return getEmployeesAsJson(id, cal.get(Calendar.YEAR));
	}

	public String getEmployeesAsJson() {
		Calendar cal = new GregorianCalendar();
		return getEmployeesAsJson(null, cal.get(Calendar.YEAR));
	}

	private String getEmployeesAsJson(String id, int year) {
		String sql = "SELECT e.image, e.first_name, e.last_name, e.jobtitle, e.city, e.text, "
				+ "e.project_id, p.project_name, p.city AS pcity, h.number_of_days AS holiday2015 "
				+ "FROM employee e, project p, holiday_employee h "
				+ "	 WHERE e.project_id = p.id AND e.id = h.employee_id AND h.year = " + year;
		if (id != null && !id.isEmpty())
			sql += " AND e.id = " + id;
		ResultSet rs = doSelect(sql);
		try {
			List jsonArray = new ArrayList();
			while (rs.next()) {
				Map<String, Object> jsonMap = new HashMap<String, Object>();
				jsonMap.put("image", rs.getString("image"));
				jsonMap.put("firstName", rs.getString("first_name"));
				jsonMap.put("lastName", rs.getString("last_name"));
				jsonMap.put("fullName", rs.getString("first_name") + " " + rs.getString("last_name"));
				jsonMap.put("jobTitle", rs.getString("jobtitle"));
				jsonMap.put("city", rs.getString("city"));
				jsonMap.put("projectId", rs.getInt("project_id"));
				jsonMap.put("projectName", rs.getString("project_name"));
				jsonMap.put("projectCity", rs.getString("pcity"));
				jsonMap.put("holiday2015", rs.getInt("holiday2015"));
				jsonMap.put("text", rs.getString("text"));

				jsonArray.add(jsonMap);
			}
			return JSONValue.toJSONString(jsonArray);

		} catch (SQLException e) {
			LOG.log(Level.SEVERE, e.getMessage(), e);
		} finally {
			DbUtil.closeQuietly(conn, stmt, rs);
		}
		return "";
	}

	public String getProjectsAsJson() {
		String sql = "SELECT p.id, p.icon, p.client, p.project_name, p.city, "
				+ "group_concat(e.id) as emp_ids, group_concat(concat(e.first_name, \" \", e.last_name)) as emp_names "
				+ "FROM project p "
				+ "INNER JOIN employee e on e.project_id = p.id "
				+ "GROUP BY p.project_name "
				+ "ORDER by p.project_name";
		ResultSet rs = doSelect(sql);
		try {
			List jsonArray = new ArrayList();
			while (rs.next()) {
				Map<String, Object> jsonMap = new HashMap<String, Object>();
				jsonMap.put("id", rs.getInt("id"));
				jsonMap.put("icon", rs.getString("icon"));
				jsonMap.put("client", rs.getString("client"));
				jsonMap.put("projectName", rs.getString("project_name"));
				jsonMap.put("city", rs.getString("city"));
				List<String> empIds = Arrays.asList(rs.getString("emp_ids").split(","));
				List<String> empNames = Arrays.asList(rs.getString("emp_names").split(","));
				jsonMap.put("empNames", empNames);
				jsonMap.put("empIds", empIds);

				jsonArray.add(jsonMap);
			}
			return JSONValue.toJSONString(jsonArray);

		} catch (SQLException e) {
			LOG.log(Level.SEVERE, e.getMessage(), e);
		} finally {
			DbUtil.closeQuietly(conn, stmt, rs);
		}
		return "";
	}

	public String getHolidaysAsJson(String employeeId) {
		String sql = "SELECT e.id, e.first_name, e.last_name, p.project_name, h.from_date, h.to_date, h.working_days  "
				+ "	FROM employee e "
				+ "	INNER JOIN project p on e.project_id = p.id "
				+ "	LEFT JOIN holiday h on e.id = h.employee_id "
				+ (employeeId != null && !employeeId.isEmpty() ? " WHERE e.id = " + employeeId : "")
				+ "	ORDER BY e.last_name ";
		ResultSet rs = doSelect(sql);
		try {
			List jsonArray = new ArrayList();
			while (rs.next()) {
				Map<String, Object> jsonMap = new HashMap<String, Object>();
				jsonMap.put("id", rs.getInt("id"));
				jsonMap.put("firstName", rs.getString("first_name"));
				jsonMap.put("lastName", rs.getString("last_name"));
				jsonMap.put("projectName", rs.getString("project_name"));
				jsonMap.put("from", rs.getString("from_date"));
				jsonMap.put("to", rs.getString("to_date"));
				jsonMap.put("workingDays", rs.getInt("working_days"));

				jsonArray.add(jsonMap);
			}
			return JSONValue.toJSONString(jsonArray);

		} catch (SQLException e) {
			LOG.log(Level.SEVERE, e.getMessage(), e);
		} finally {
			DbUtil.closeQuietly(conn, stmt, rs);
		}
		return "";
	}

	private ResultSet doSelect(String sql) {
		try {
			conn = ds.getConnection();
			stmt = conn.createStatement();
			return stmt.executeQuery(sql);
		} catch (SQLException sqle) {
			LOG.log(Level.SEVERE, sqle.getMessage(), sqle);
		}
		return null;
	}

	public boolean deleteEmployee(long id) {
		String sql = "DELETE FROM employee WHERE id = ?";
		try {
			conn = ds.getConnection();
			pstmt = conn.prepareStatement(sql);
			pstmt.setLong(1, id);
			return pstmt.executeUpdate() > 0;
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			return false;
		} finally {
			DbUtil.closeQuietly(conn, pstmt, null);
		}
	}

	public boolean deleteProject(long id) {
		String sql = "DELETE FROM project WHERE id = ?";
		try {
			conn = ds.getConnection();
			pstmt = conn.prepareStatement(sql);
			pstmt.setLong(1, id);
			return pstmt.executeUpdate() > 0;
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			return false;
		} finally {
			DbUtil.closeQuietly(conn, pstmt, null);
		}
	}

	public boolean deleteHoliday(long id) {
		String sql = "DELETE FROM holiday WHERE id = ?";
		try {
			conn = ds.getConnection();
			pstmt = conn.prepareStatement(sql);
			pstmt.setLong(1, id);
			return pstmt.executeUpdate() > 0;
		} catch (SQLException ex) {
			LOG.log(Level.SEVERE, ex.getMessage(), ex);
			return false;
		} finally {
			DbUtil.closeQuietly(conn, pstmt, null);
		}
	}

}
