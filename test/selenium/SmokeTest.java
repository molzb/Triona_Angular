package selenium;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.junit.AfterClass;
import static org.junit.Assert.assertTrue;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SmokeTest {

	private static final Logger LOGGER = Logger.getLogger(SmokeTest.class.getName());
	private static final int SLEEP = 500;
	private static final String BASE_URL = "http://localhost:8080/Triona_Angular/";

	private static WebDriver driver;

	public SmokeTest() {
	}

	@BeforeClass
	public static void setUpClass() {
		System.setProperty("webdriver.chrome.driver", "/javascript/nodejs/chromedriver.exe");
		driver = new ChromeDriver();
		driver.manage().window().setSize(new Dimension(1500, 860));
	}

	@AfterClass
	public static void tearDownClass() {
		driver.quit();
	}

	@Test
	public void a_loginManager() {
		assertTrue(login("bernhard.molz@triona.de", "bernhard55130"));
	}

	@Test
	public void b_smokeManager() {
		assertTrue(gotoUrl(BASE_URL + "#/team", "The team"));
		assertTrue(gotoUrl(BASE_URL + "#/projects", "Projects"));
		assertTrue(gotoUrl(BASE_URL + "#/holidays", "Holidays"));
		assertTrue(gotoUrl(BASE_URL + "#/detailEmployee/1", "Details about Holger Klatt"));
		assertTrue(gotoUrl(BASE_URL + "#/addEmployee", "Create employee"));
		assertTrue(gotoUrl(BASE_URL + "#/editEmployee/1", "Edit employee"));
		assertTrue(gotoUrl(BASE_URL + "#/timesheets", "Timesheets"));
		assertTrue(gotoUrl(BASE_URL + "#/editTimesheet/1", "Create timesheet"));
		assertTrue(gotoUrl(BASE_URL + "#/fixedDates", "Fest zum 1.6."));
		assertTrue(gotoUrl(BASE_URL + "#/editFixedDate/1", "Add date"));
		assertTrue(gotoUrl(BASE_URL + "#/logout", null));
	}

	@Test
	public void c_loginEmployee() {
		assertTrue(login("tobias.schmidt@triona.de", "tobias55130"));
	}

	@Test
	public void d_smokeManager() {
		assertTrue(gotoUrl(BASE_URL + "#/team", "The team"));
		assertTrue(gotoUrl(BASE_URL + "#/projects", "Projects"));
		assertTrue(gotoUrl(BASE_URL + "#/holidays", "Holidays"));
		assertTrue(gotoUrl(BASE_URL + "#/detailEmployee/1", "Details about Holger Klatt"));
		assertTrue(gotoUrl(BASE_URL + "#/addEmployee", "Create employee"));
		assertTrue(gotoUrl(BASE_URL + "#/editEmployee/1", "Edit employee"));
		assertTrue(gotoUrl(BASE_URL + "#/timesheets", "Timesheets"));
		assertTrue(gotoUrl(BASE_URL + "#/editTimesheet/1", "Create timesheet"));
		assertTrue(gotoUrl(BASE_URL + "#/fixedDates", "Fest zum 1.6."));
		assertTrue(gotoUrl(BASE_URL + "#/editFixedDate/1", "Add date"));
		assertTrue(gotoUrl(BASE_URL + "#/logout", null));
	}

	public boolean login(String username, String password) {
		driver.get(BASE_URL);
		WebElement inputUser = driver.findElement(By.name("j_username"));
		inputUser.sendKeys(username);
		WebElement inputPassword = driver.findElement(By.name("j_password"));
		inputPassword.sendKeys(password);

		assertTrue(inputPassword.isDisplayed());
		String baseUrl = driver.getCurrentUrl();
		inputPassword.submit();	// before BASE_URL, after BASE_URL#/home
		return baseUrl.equals(BASE_URL);
	}

	private boolean gotoUrl(String url, String header) {
		driver.get(url);
		LOGGER.info("gotoUrl " + url);
		sleep(100);
		WebElement pageHeader = findByClass("page-header");
		boolean isHeaderFine = pageHeader == null || header == null || pageHeader.getText().equals(header);
		if (!isHeaderFine)
			LOGGER.warning("header=" + header + ", .page-header=" + (pageHeader == null ? "null" : pageHeader.getText())
				+ ", FAIL");
		sleep(SLEEP);
		return driver.getCurrentUrl().equals(url) && isHeaderFine;
	}

	private WebElement findByClass(String clazz) {
		try {
			return driver.findElement(By.className(clazz));
		} catch (NoSuchElementException nse) {
			LOGGER.warning("Couldn't find element with ." + clazz);
			return null;
		}
	}

	private void sleep(int ms) {
		try {
			Thread.sleep(ms);
		} catch (InterruptedException ex) {
			LOGGER.log(Level.SEVERE, null, ex);
		}
	}
}