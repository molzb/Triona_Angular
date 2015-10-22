package persistence;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 *
 * @author Bernhard
 */
public class MyDataSource extends MysqlDataSource {
	@Override
	public Connection getConnection() throws SQLException {
		setUser("root");
		setPassword("Pianoman65536");
		setURL("jdbc:mysql://localhost:3306/triona");
		return super.getConnection();
	}
}
