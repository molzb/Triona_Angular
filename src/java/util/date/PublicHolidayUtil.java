package util.date;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.dbutils.QueryRunner;

/**
 * Hilfsklasse, um die gesetzlichen Feiertage abhängig vom Bundesland zu bestimmen. Quellen: <br>
 * <a href="http://de.wikipedia.org/wiki/Feiertage_in_Deutschland">Wiki Feiertage</a><br>
 * <a href="http://de.wikipedia.org/wiki/Gau%C3%9Fsche_Osterformel">Wiki Osterformel</a><br>
 * @author Bernhard Molz
 */
public class PublicHolidayUtil {

	private static final SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
	private static final int
			H_NEUJAHR = 0, H_DREIKOENIGE = 1, H_GRUENDONNERSTAG = 2, H_KARFREITAG = 3, H_OSTERMONTAG = 4,
			H_TAGDERARBEIT = 5, H_CHHIMMELFAHRT = 6, H_PFINGSTMONTAG = 7, H_FRONLEICHNAM = 8, H_FRIEDENSFEST = 9,
			H_MHIMMELFAHRT = 10, H_DEUTSCHE_EINHEIT = 11, H_REFORMATION = 12, H_ALLERHEILIGEN = 13,
			H_BUSSUNDBET = 14, H_WEIHNACHT1 = 15, H_WEIHNACHT2 = 16;
	/**
	 * Die Namen der gesetzlichen Feiertage in Deutschland ohne Berücksichtigung der Bundesländer
	 */
	private static final String[] fullNames = {
		"Neujahrstag", // [0] 1. Januar
		"Heilige Drei Könige", // [1] 6. Januar
		"Gründonnerstag", // [2] Ostersonntag - 3 Tage
		"Karfreitag", // [3] Ostersonntag - 2 Tage
		"Ostermontag", // [4] Ostersonntag + 1 Tag
		"Tag der Arbeit", // [5] 1. Mai
		"Christi Himmelfahrt", // [6] Ostersonntag + 39 Tage
		"Pfingstmontag", // [7] Ostersonntag + 50 Tage
		"Fronleichnam", // [8] Ostersonntag + 60 Tage
		"Augsburger Friedensfest", // [9] 8. August
		"Mariä Himmelfahrt", // [10] 15. August
		"Tag der Deutschen Einheit",// [11] 3. Oktober
		"Reformationstag", // [12] 31. Oktober
		"Allerheiligen", // [13] 1. November
		"Buß- und Bettag", // [14] Mittwoch vor dem 23. November
		"1. Weihnachtstag", // [15] 25. Dezember
		"2. Weihnachtstag" // [16] 26. Dezember
	};

	/** Alle gesetzl. Feiertage in Rheinland-Pfalz (Sitz der Triona GmbH) im Jahr <code>year</code>*/
	public static Map<String, GregorianCalendar> getPublicHolidays(int year) {
		return getPublicHolidays(EnumState.RP, year);
	}

	public static void main(String[] args) throws SQLException, ClassNotFoundException {
		for (int i = 2000; i < 2040; i++)
			writeHolidaysToDB(EnumState.RP, i);
	}

	public static boolean writeHolidaysToDB(EnumState stateCode, int year) throws SQLException, ClassNotFoundException {
		Map<String, GregorianCalendar> publicHolidays = PublicHolidayUtil.getPublicHolidays(stateCode, year);
		Class.forName("com.mysql.jdbc.Driver");
		Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/triona", "root", "Pianoman65536");

		String sqlInsert = "INSERT INTO specialday (day, type, name) VALUES (?, 'holiday', ?)";
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		QueryRunner q = new QueryRunner();
//		q.update(conn, "DELETE FROM specialday WHERE type = 'holiday'");

		for (Entry<String, GregorianCalendar> entrySet : publicHolidays.entrySet()) {
			String name = entrySet.getKey();
			Date date = entrySet.getValue().getTime();
			System.out.println(df.format(date) + ":" + name);
			q.update(conn, sqlInsert, df.format(date), name);
		}
		DbUtils.closeQuietly(conn);

		return true;
	}

	/**
	 * Alle gesetzl. Feiertage im Bundesland x im Jahr <code>year</code>
	 * @param stateCode 2-Buchstaben-Code des Bundeslands, s. EnumState
	 * @param year 4-stelliges Jahr, z.B. 2011
	 * @return Map[String, GregorianCalendar] der Feiertage
	 */
	public static Map<String, GregorianCalendar> getPublicHolidays(EnumState stateCode, int year) {
		Map<String, GregorianCalendar> holidays = PublicHolidayUtil.getAllLegalHolidaysFor(year);
		switch (stateCode) {
			case BW:
			case BY:
				holidays.remove(fullNames[H_GRUENDONNERSTAG]);
				holidays.remove(fullNames[H_FRIEDENSFEST]);
				holidays.remove(fullNames[H_MHIMMELFAHRT]);
				holidays.remove(fullNames[H_REFORMATION]);
				holidays.remove(fullNames[H_BUSSUNDBET]);
				break;
			case BE:
			case HB:
			case HH:
			case NI:
			case SH:
				holidays.remove(fullNames[H_DREIKOENIGE]);
				holidays.remove(fullNames[H_GRUENDONNERSTAG]);
				holidays.remove(fullNames[H_FRONLEICHNAM]);
				holidays.remove(fullNames[H_FRIEDENSFEST]);
				holidays.remove(fullNames[H_MHIMMELFAHRT]);
				holidays.remove(fullNames[H_REFORMATION]);
				holidays.remove(fullNames[H_ALLERHEILIGEN]);
				holidays.remove(fullNames[H_BUSSUNDBET]);
				break;
			case BB:
			case MV:
			case TH:
				holidays.remove(fullNames[H_DREIKOENIGE]);
				holidays.remove(fullNames[H_GRUENDONNERSTAG]);
				holidays.remove(fullNames[H_FRONLEICHNAM]);
				holidays.remove(fullNames[H_FRIEDENSFEST]);
				holidays.remove(fullNames[H_MHIMMELFAHRT]);
				holidays.remove(fullNames[H_ALLERHEILIGEN]);
				holidays.remove(fullNames[H_BUSSUNDBET]);
				break;
			case NW:
			case RP:
				holidays.remove(fullNames[H_DREIKOENIGE]);
				holidays.remove(fullNames[H_GRUENDONNERSTAG]);
				holidays.remove(fullNames[H_FRIEDENSFEST]);
				holidays.remove(fullNames[H_MHIMMELFAHRT]);
				holidays.remove(fullNames[H_REFORMATION]);
				holidays.remove(fullNames[H_BUSSUNDBET]);
				break;
			case HE:
				holidays.remove(fullNames[H_DREIKOENIGE]);
				holidays.remove(fullNames[H_GRUENDONNERSTAG]);
				holidays.remove(fullNames[H_FRIEDENSFEST]);
				holidays.remove(fullNames[H_MHIMMELFAHRT]);
				holidays.remove(fullNames[H_REFORMATION]);
				holidays.remove(fullNames[H_ALLERHEILIGEN]);
				holidays.remove(fullNames[H_BUSSUNDBET]);
				break;
			case SL:
				holidays.remove(fullNames[H_DREIKOENIGE]);
				holidays.remove(fullNames[H_GRUENDONNERSTAG]);
				holidays.remove(fullNames[H_FRIEDENSFEST]);
				holidays.remove(fullNames[H_REFORMATION]);
				holidays.remove(fullNames[H_BUSSUNDBET]);
				break;
			case SN:
				holidays.remove(fullNames[H_DREIKOENIGE]);
				holidays.remove(fullNames[H_GRUENDONNERSTAG]);
				holidays.remove(fullNames[H_FRONLEICHNAM]);
				holidays.remove(fullNames[H_FRIEDENSFEST]);
				holidays.remove(fullNames[H_MHIMMELFAHRT]);
				holidays.remove(fullNames[H_ALLERHEILIGEN]);
				break;
			case ST:
				holidays.remove(fullNames[H_GRUENDONNERSTAG]);
				holidays.remove(fullNames[H_FRONLEICHNAM]);
				holidays.remove(fullNames[H_FRIEDENSFEST]);
				holidays.remove(fullNames[H_MHIMMELFAHRT]);
				holidays.remove(fullNames[H_ALLERHEILIGEN]);
				holidays.remove(fullNames[H_BUSSUNDBET]);
				break;
			default:
				System.err.println(stateCode + " not supported");
		}
		return holidays;
	}

	public static Map<String, GregorianCalendar> getAllLegalHolidaysFor(int year) {
		Map<String, GregorianCalendar> holidayMap = new HashMap<>();
		GregorianCalendar easter = getEaster(year);
		GregorianCalendar gruenDonnerstag = (GregorianCalendar) easter.clone();
		gruenDonnerstag.add(Calendar.DAY_OF_YEAR, -3);
		GregorianCalendar karFreitag = (GregorianCalendar) easter.clone();
		karFreitag.add(Calendar.DAY_OF_YEAR, -2);
		GregorianCalendar osterMontag = (GregorianCalendar) easter.clone();
		osterMontag.add(Calendar.DAY_OF_YEAR, 1);
		GregorianCalendar christiHimmelfahrt = (GregorianCalendar) easter.clone();
		christiHimmelfahrt.add(Calendar.DAY_OF_YEAR, 39);
		GregorianCalendar pfingstMontag = (GregorianCalendar) easter.clone();
		pfingstMontag.add(Calendar.DAY_OF_YEAR, 50);
		GregorianCalendar fronleichnam = (GregorianCalendar) easter.clone();
		fronleichnam.add(Calendar.DAY_OF_YEAR, 60);
		// Buß- und Bettag ist am Mittwoch VOR dem 23.11.
		GregorianCalendar bussUndBettag = new GregorianCalendar(year, 10, 22);
		while (bussUndBettag.get(Calendar.DAY_OF_WEEK) != Calendar.WEDNESDAY) {
			bussUndBettag.add(Calendar.DAY_OF_YEAR, -1);
		}

		holidayMap.put(fullNames[H_NEUJAHR], new GregorianCalendar(year, 0, 1));
		holidayMap.put(fullNames[H_DREIKOENIGE], new GregorianCalendar(year, 0, 6));
		holidayMap.put(fullNames[H_GRUENDONNERSTAG], gruenDonnerstag);
		if (!holidayMap.containsValue(karFreitag))
			holidayMap.put(fullNames[H_KARFREITAG], karFreitag);
		holidayMap.put(fullNames[H_OSTERMONTAG], osterMontag);
		holidayMap.put(fullNames[H_TAGDERARBEIT], new GregorianCalendar(year, 4, 1));
		if (!holidayMap.containsValue(christiHimmelfahrt))
			holidayMap.put(fullNames[H_CHHIMMELFAHRT], christiHimmelfahrt);
		holidayMap.put(fullNames[H_PFINGSTMONTAG], pfingstMontag);
		holidayMap.put(fullNames[H_FRONLEICHNAM], fronleichnam);
		holidayMap.put(fullNames[H_FRIEDENSFEST], new GregorianCalendar(year, 7, 8));
		holidayMap.put(fullNames[H_MHIMMELFAHRT], new GregorianCalendar(year, 7, 15));
		holidayMap.put(fullNames[H_DEUTSCHE_EINHEIT], new GregorianCalendar(year, 9, 3));
		holidayMap.put(fullNames[H_REFORMATION], new GregorianCalendar(year, 9, 31));
		holidayMap.put(fullNames[H_ALLERHEILIGEN], new GregorianCalendar(year, 10, 1));
		if (!holidayMap.containsValue(bussUndBettag))
			holidayMap.put(fullNames[H_BUSSUNDBET], bussUndBettag);	// Buß- und Bettag
		holidayMap.put(fullNames[H_WEIHNACHT1], new GregorianCalendar(year, 11, 25));
		holidayMap.put(fullNames[H_WEIHNACHT2], new GregorianCalendar(year, 11, 26));

		return holidayMap;
	}

	/**
	 * Berechnet Ostern nach Gaußscher Osterformel (lt. Wiki)
	 * @param year Das Jahr als 4-stellige Zahl, z.B. 2011
	 * @return Ostern im Jahr <code>year</code>
	 */
	public static GregorianCalendar getEaster(int year) {
		int a = year % 19;
		int b = year % 4;
		int c = year % 7;
		int k = year / 100;
		int p = (8 * k + 13) / 25;
		int q = k / 4;
		int M = (15 + k - p - q) % 30;
		int N = (4 + k - q) % 7;
		int d = (19 * a + M) % 30;
		int e = (2 * b + 4 * c + 6 * d + N) % 7;
		int nthMarch = 22 + d + e;
		return new GregorianCalendar(year, 2, nthMarch);
	}

	public static Map<String, GregorianCalendar> getPublicHolidayBetween(GregorianCalendar from,
			GregorianCalendar to, EnumState stateCode) {
		int yearFrom = from.get(Calendar.YEAR);
		int yearTo = to.get(Calendar.YEAR);
		Map<String, GregorianCalendar> holidays = PublicHolidayUtil.getPublicHolidays(stateCode, yearFrom);
		System.out.println(yearFrom + "holidays.size vorher: " + holidays.size());
		if (yearTo > yearFrom) {
			Map<String, GregorianCalendar> holidaysTo = PublicHolidayUtil.getPublicHolidays(stateCode, yearTo);
			for (Entry<String, GregorianCalendar> set : holidaysTo.entrySet()) {
				holidays.put(set.getKey(), set.getValue());
			}
			System.out.println(yearTo + "holidays.size nachher: " + holidays.size());
		}
		Map<String, GregorianCalendar> holidaysFromTo = new HashMap<>();
		while (from.getTimeInMillis() <= to.getTimeInMillis()) {
			Iterator<String> keySetIt = holidays.keySet().iterator();
			System.out.println("from=" + sdf.format(new Date(from.getTimeInMillis())));
			while (keySetIt.hasNext()) {
				String key = keySetIt.next();
				GregorianCalendar g = holidays.get(key);
				if (isDateEqual(from, g)) {
					holidaysFromTo.put(key, g);
					System.out.println("added " + g);
				}
			}
			from.add(Calendar.DAY_OF_YEAR, 1);
		}

		return holidaysFromTo;
	}

	private static boolean isDateEqual(GregorianCalendar g1, GregorianCalendar g2) {
		Date d1 = new Date(g1.getTimeInMillis());
		Date d2 = new Date(g2.getTimeInMillis());
		System.out.println("Vergleiche " + sdf.format(d1) + " mit " + sdf.format(d2));
		if (g1.get(Calendar.DAY_OF_YEAR) != g2.get(Calendar.DAY_OF_YEAR)) {
			return false;
		}
		if (g1.get(Calendar.MONTH) != g2.get(Calendar.MONTH)) {
			return false;
		}
		return g1.get(Calendar.YEAR) == g2.get(Calendar.YEAR);
	}
}
