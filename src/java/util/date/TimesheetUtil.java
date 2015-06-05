package util.date;

import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Random;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.dbutils.QueryRunner;
import persistence.MyDataSource;

/**
 * Hilfsklasse, um Timesheets einzufügen>
 * @author Bernhard Molz
 */
public class TimesheetUtil {

	private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	private static final long HOUR_IN_MS = 3600000, MIN_IN_MS = 60000;

	public static void main(String[] args) throws SQLException, ClassNotFoundException {
		TimesheetUtil timesheetUtil = new TimesheetUtil();
		for (int i = 0; i <= 13; i++) {
			timesheetUtil.writeHolidaysToDB(i, 2014, 12);
			timesheetUtil.writeHolidaysToDB(i, 2015, 5);
		}
	}

	public boolean writeHolidaysToDB(int employeeId, int year, int upToMonth) throws SQLException, ClassNotFoundException {
		long t1 = System.currentTimeMillis();
		Connection conn = new MyDataSource().getConnection();

		String sqlInsert = "INSERT INTO timesheet (employee_id, project_id, day, from_, to_, "
				+ "pause, duration, comment) VALUES (?,?,?,?,  ?,?,?,?)";
		QueryRunner q = new QueryRunner();

		Calendar cal = new GregorianCalendar(year, 0, 1);

		String[] froms = new String[] { "08:00", "09:00", "10:00" };
		String[] pauses = new String[] { "0:00", "1:00", "2:00" };
		while (cal.get(Calendar.YEAR) < year+1 && cal.get(Calendar.MONTH) <= upToMonth) {
			String dateStr = sdf.format(cal.getTime());
			String from  = froms[new Random().nextInt(froms.length)];
			String pause = pauses[new Random().nextInt(pauses.length)];
			int worktimeInHours = new Random().nextInt(3) + 7;
			int fromHour = Integer.parseInt(from.substring(0,2));
			String to = String.valueOf(fromHour + worktimeInHours) + from.substring(2);
			String duration = String.valueOf(worktimeInHours) + ":00";
			System.out.println("day/from/to/pause/duration=" + dateStr + "/" + from + "/" + to + "/" + pause + "/" + duration);
			q.update(conn, sqlInsert, employeeId, 1, dateStr, from, to, pause, duration, "comment");
			cal.add(Calendar.DAY_OF_YEAR, cal.get(Calendar.DAY_OF_WEEK) == 6 ? 3 : 1);
		}
		DbUtils.closeQuietly(conn);
		System.out.println("Dauer: " + (System.currentTimeMillis() - t1));
		return true;
	}

}
