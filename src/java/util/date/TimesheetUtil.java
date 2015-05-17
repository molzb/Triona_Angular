package util.date;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Time;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Random;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.dbutils.QueryRunner;

/**
 * Hilfsklasse, um Timesheets einzufügen>
 * @author Bernhard Molz
 */
public class TimesheetUtil {

	private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	private static final long HOUR_IN_MS = 3600000, MIN_IN_MS = 60000;

	public static void main(String[] args) throws SQLException, ClassNotFoundException {
//		System.out.println(new Time(0L));
//		Time t012 = new Time(0,1,2);
//		Time t000 = new Time(0,0,0);
//		Time tmin100 = new Time(-1,0,0);
//		Time t100 = new Time(1,0,0);
//		Time t2300 = new Time(23,0,0);
//
//		Time t2300_2 = new Time(23 * HOUR_IN_MS + 30 * MIN_IN_MS);
//		Time t100_2  = new Time(HOUR_IN_MS);
//		System.out.println("t000=" + t000 + "/" + t000.getTime() + ", hours=" + t000.getHours());
//		System.out.println("tmin100=" + tmin100 + "/" + tmin100.getTime() + ", hours=" + tmin100.getHours());
//		System.out.println("tmin2300=" + t2300 + "/" + t2300.getTime() + ", hours=" + t2300.getHours());
//		System.out.println("tmin2300_2=" + t2300_2 + "/" + t2300_2.getTime() + ", hours=" + t2300_2.getHours());
//		System.out.println(t100.getTime());
//		System.out.println( new Time(t2300.getTime() - t100.getTime() - t100.getTime()) );
//		System.out.println( new Time(t2300_2.getTime() - t100_2.getTime() - t100_2.getTime()) );
		TimesheetUtil timesheetUtil = new TimesheetUtil();
		for (int i = 0; i <= 13; i++) {
			timesheetUtil.writeHolidaysToDB(i, 2014, 12);
			timesheetUtil.writeHolidaysToDB(i, 2015, 5);
		}
	}

	public boolean writeHolidaysToDB(int employeeId, int year, int upToMonth) throws SQLException, ClassNotFoundException {
		long t1 = System.currentTimeMillis();
		Class.forName("com.mysql.jdbc.Driver");
		Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/triona", "root", "Pianoman65536");

		String sqlInsert = "INSERT INTO timesheet (employee_id, project_id, day, from_time, to_time, pause_time, "
				+ "duration, diff_time, comment) VALUES (?,?,?,  ?,?,?,  ?,?,?)";
		QueryRunner q = new QueryRunner();

		Calendar cal = new GregorianCalendar(year, 0, 1);

		Time[] froms = new Time[]  { new Time(8,0,0), new Time(9,0,0), new Time(10,30,0)};
		Time[] pauses = new Time[] { new Time(0,30,0), new Time(1,0,0), new Time(1,30,0)};
		while (cal.get(Calendar.YEAR) < year+1 && cal.get(Calendar.MONTH) <= upToMonth) {
			String dateStr = sdf.format(cal.getTime());
			Time from  = froms[new Random().nextInt(froms.length)];
			Time pause = pauses[new Random().nextInt(pauses.length)];
			int worktimeInHours = new Random().nextInt(3) + 7;
			Time to    = new Time(from.getHours() + worktimeInHours, from.getMinutes(),0);
			Time diff = new Time(worktimeInHours - 8,0,0);
			Time duration = new Time(to.getTime() - (from.getTime() + HOUR_IN_MS) - (pause.getTime() + HOUR_IN_MS));
			System.out.println("day/from/to/pause/duration=" + dateStr + "/" + from + "/" + to + "/" + pause + "/" + duration);
			q.update(conn, sqlInsert, employeeId, 1, dateStr, from, to, pause, duration, diff, "comment");
			cal.add(Calendar.DAY_OF_YEAR, cal.get(Calendar.DAY_OF_WEEK) == 6 ? 3 : 1);
		}
		DbUtils.closeQuietly(conn);
		System.out.println("Dauer: " + (System.currentTimeMillis() - t1));
		return true;
	}

}
