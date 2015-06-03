package test.selenium;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.junit.After;
import org.junit.AfterClass;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
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

	@Before
	public void setUp() {
	}

	@After
	public void tearDown() {
	}

	@Test
	public void a_loginManager() {
		assertTrue(login("bernhard.molz@triona.de", "bernhard55130"));
	}

	@Test
	public void b_smokeManager() {
		assertTrue(gotoUrl(BASE_URL + "#/team"));
		assertTrue(gotoUrl(BASE_URL + "#/projects"));
		assertTrue(gotoUrl(BASE_URL + "#/holidays"));
		assertTrue(gotoUrl(BASE_URL + "#/detailEmployee/1"));
		assertTrue(gotoUrl(BASE_URL + "#/addEmployee"));
		assertTrue(gotoUrl(BASE_URL + "#/editEmployee/1"));
		assertTrue(gotoUrl(BASE_URL + "#/timesheets"));
		assertTrue(gotoUrl(BASE_URL + "#/editTimesheet/1"));
		assertTrue(gotoUrl(BASE_URL + "#/fixedDates"));
		assertTrue(gotoUrl(BASE_URL + "#/editFixedDate/1"));
		assertTrue(gotoUrl(BASE_URL + "#/logout"));
	}

	@Test
	public void c_loginEmployee() {
		assertTrue(login("tobias.schmidt@triona.de", "tobias55130"));
	}

	@Test
	public void d_smokeManager() {
		assertTrue(gotoUrl(BASE_URL + "#/team"));
		assertTrue(gotoUrl(BASE_URL + "#/projects"));
		assertTrue(gotoUrl(BASE_URL + "#/holidays"));
		assertTrue(gotoUrl(BASE_URL + "#/detailEmployee/1"));
		assertTrue(gotoUrl(BASE_URL + "#/addEmployee"));
		assertTrue(gotoUrl(BASE_URL + "#/editEmployee/1"));
		assertTrue(gotoUrl(BASE_URL + "#/timesheets"));
		assertTrue(gotoUrl(BASE_URL + "#/editTimesheet/1"));
		assertTrue(gotoUrl(BASE_URL + "#/fixedDates"));
		assertTrue(gotoUrl(BASE_URL + "#/editFixedDate/1"));
		assertTrue(gotoUrl(BASE_URL + "#/logout"));
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

	private boolean gotoUrl(String url) {
		driver.get(url);
		sleep(SLEEP);
		return driver.getCurrentUrl().equals(url);
	}

	private void sleep(int ms) {
		try {
			Thread.sleep(ms);
		} catch (InterruptedException ex) {
			LOGGER.log(Level.SEVERE, null, ex);
		}
	}
}