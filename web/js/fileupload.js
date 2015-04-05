//http://www.script-tutorials.com/pure-html5-file-upload/

// common variables
var iMaxFilesize = 1048576; // 1MB
var sResultFileSize = '';

function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB'];
	if (bytes === 0)
		return 'n/a';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}
;

function fileSelected() {
	// hide different warnings
	document.getElementById('error').style.display = 'none';
	document.getElementById('error2').style.display = 'none';
	document.getElementById('abort').style.display = 'none';
	document.getElementById('warnsize').style.display = 'none';

	// get selected file element
	var oFile = document.getElementById('image_file').files[0];

	// filter for image files
	var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
	if (!rFilter.test(oFile.type)) {
		document.getElementById('error').style.display = 'block';
		return;
	}

	// little test for filesize
	if (oFile.size > iMaxFilesize) {
		document.getElementById('warnsize').style.display = 'block';
		return;
	}

	// get preview element
	var oImage = document.getElementById('preview');

	// prepare HTML5 FileReader
	var oReader = new FileReader();
	oReader.onload = function (e) {

		// e.target.result contains the DataURL which we will use as a source of the image
		oImage.src = e.target.result;

		oImage.onload = function () { // binding onload event

			// we are going to display some custom image information here
			sResultFileSize = bytesToSize(oFile.size);
			document.getElementById('fileinfo').style.display = 'block';
			document.getElementById('filename').innerHTML = 'Name: ' + oFile.name;
			document.getElementById('filesize').innerHTML = 'Size: ' + sResultFileSize;
			document.getElementById('filedim').innerHTML = 'Dimension: ' + oImage.naturalWidth + ' x ' + oImage.naturalHeight;
		};
	};

	// read selected file as DataURL
	oReader.readAsDataURL(oFile);
}

function startUploading() {
	// cleanup all temp states
	document.getElementById('error').style.display = 'none';
	document.getElementById('error2').style.display = 'none';
	document.getElementById('abort').style.display = 'none';
	document.getElementById('warnsize').style.display = 'none';

	// get image data for POSTing
	var vFD = new FormData();
	vFD.append('pictureFile', document.getElementById("image_file").files[0]);

	// create XMLHttpRequest object, adding few event listeners, and POSTing our data
	var oXHR = new XMLHttpRequest();
	oXHR.addEventListener('error', uploadError, false);
	oXHR.addEventListener('abort', uploadAbort, false);
	oXHR.open('POST', 'UploadServlet');
	oXHR.send(vFD);
}

function uploadError(e) { // upload error
	document.getElementById('error2').style.display = 'block';
}

function uploadAbort(e) { // upload abort
	document.getElementById('abort').style.display = 'block';
}