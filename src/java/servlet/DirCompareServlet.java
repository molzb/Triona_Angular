package servlet;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONValue;

@WebServlet(name = "DirCompareServlet", urlPatterns = {"/DirCompareServlet"})
public class DirCompareServlet extends HttpServlet {

	private static final Logger LOG = Logger.getLogger(DirCompareServlet.class.getName());
	private final String DIR1 = "C:\\Users\\Bernhard\\Documents\\NetBeansProjects\\Triona_Angular\\web";
	private final String DIR2 = "C:\\UAT";
	private final String DIR3 = "C:\\PROD";
	private final DateFormat sdf = new SimpleDateFormat("dd.MM.yyyy hh:mm:ss");

	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json;charset=UTF-8");
		List<List> dirs = new ArrayList<>();
		String includeFilterPrm = request.getParameter("includeFilter");
		String excludeFilterPrm = request.getParameter("excludeFilter");
		String[] includeFilter = includeFilterPrm == null ? new String[] {} : includeFilterPrm.split(",");
		String[] excludeFilter = excludeFilterPrm == null ? new String[] {} : excludeFilterPrm.split(",");

		try (PrintWriter out = response.getWriter()) {
			dirs.add(getFilesAsJson(DIR1, includeFilter, excludeFilter));
			dirs.add(getFilesAsJson(DIR2, includeFilter, excludeFilter));
			dirs.add(getFilesAsJson(DIR3, includeFilter, excludeFilter));
			out.println(JSONValue.toJSONString(dirs));
		}
	}

	private List getFilesAsJson(String dir, String[] includeFilter, String[] excludeFilter) {
		File dirFile = new File(dir);
		List jsonArray = new ArrayList();
		if (!dirFile.isDirectory()) {
			LOG.log(Level.SEVERE, dirFile.getAbsolutePath() + " is not a dir!");
			return jsonArray;
		}
		File[] files = dirFile.listFiles(new MyFileFilter(includeFilter, excludeFilter));
		for (File f : files) {
			Map<String, Object> jsonMap = new HashMap<String, Object>();
			jsonMap.put("permissions", f.canRead());
			jsonMap.put("name", f.getName());
			jsonMap.put("dir", f.getParent());
			jsonMap.put("length", f.length());
			jsonMap.put("lastModified", sdf.format(new Date(f.lastModified())));

			jsonArray.add(jsonMap);
		}
		return jsonArray;
	}

	// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}// </editor-fold>
}

class MyFileFilter implements FileFilter {

	private List<String> includedSufficesList = new ArrayList<String>();
	private List<String> excludedSufficesList = new ArrayList<String>();

	MyFileFilter() {}

	MyFileFilter(String[] includedSuffices, String[] excludedSuffices) {
		this.includedSufficesList = Arrays.asList(includedSuffices);
		this.excludedSufficesList = Arrays.asList(excludedSuffices);
	}

	@Override
	public boolean accept(File f) {
		if (f.isDirectory())
			return false;

		if (includedSufficesList.isEmpty() && excludedSufficesList.isEmpty())
			return true;
		
		int indexOfSuffix = f.getName().lastIndexOf('.');
		String suffix = f.getName().toLowerCase().substring(indexOfSuffix + 1);
		boolean accepted = includedSufficesList.contains(suffix);
		return accepted;
	}
}
