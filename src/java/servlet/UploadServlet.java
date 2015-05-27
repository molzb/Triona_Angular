package servlet;

import java.io.File;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

/**
 * Handler for File Upload
 * http://www.codejava.net/java-ee/servlet/java-file-upload-example-with-servlet-30-api
 */
@WebServlet(name = "UploadServlet", urlPatterns = {"/UploadServlet"})
@MultipartConfig(fileSizeThreshold = 100000, maxFileSize = 100000, maxRequestSize = 100000)
public class UploadServlet extends HttpServlet {

	// Name of the directory where uploaded files will be saved, relative to the web application directory.
	private static final String SAVE_DIR = "images";
	private static final String SAVE_DIR2 = "C:/Users/Bernhard/Documents/NetBeansProjects/Triona_Angular/web/images";

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// gets absolute path of the web application
		String appPath = request.getServletContext().getRealPath("");
		// constructs path of the directory to save uploaded file
		String savePath  = appPath + File.separator + SAVE_DIR  + File.separator;
		String savePath2 = SAVE_DIR2 + File.separator;

		for (Part part : request.getParts()) {
			String fileName = extractFileName(part);
			part.write(savePath  + fileName);
			part.write(savePath2 + fileName);
		}

		request.setAttribute("message", "Upload has been done successfully!");
	}

	/**
	 * Extracts file name from HTTP header content-disposition
	 */
	private String extractFileName(Part part) {
		String contentDisp = part.getHeader("content-disposition");
		String[] items = contentDisp.split(";");
		for (String s : items) {
			if (s.trim().startsWith("filename")) {
				return s.substring(s.indexOf("=") + 2, s.length() - 1);
			}
		}
		return "";
	}
}
