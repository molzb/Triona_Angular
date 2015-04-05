package persistence;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Bernhard
 */
public class DbUtil {

	private static final Logger logger = Logger.getLogger(DbUtil.class.getName());

	public static void closeQuietly(Connection conn, Statement stmt, ResultSet rs) {
		if (conn != null) {
			try {
				conn.close();
			} catch (SQLException ex) {
				logger.log(Level.SEVERE, null, ex);
			}
		}
		if (stmt != null) {
			try {
				stmt.close();
			} catch (SQLException ex) {
				logger.log(Level.SEVERE, null, ex);
			}
		}
		if (rs != null) {
			try {
				rs.close();
			} catch (SQLException ex) {
				logger.log(Level.SEVERE, null, ex);
			}
		}
	}
}
