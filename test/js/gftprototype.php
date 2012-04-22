<?php
$allowed_files = array("index.html", "sample.html");
$allowed_types = array("text", "junit-xml");
$type = "text";
if (isset($_GET['type'])) {
	$type = $_GET['type'];
}

$file = "index.html";
if (isset($_GET['file'])) {
	$file = $_GET['file'];
}

if (!in_array($type,$allowed_types) || !in_array($file,$allowed_files)) {
	exit(1);
} else {
	$url = "http://gft.rdmr.ch/test/js/" . $file;
	/* Display 99 is configured on the server using Xvfb */
	$value = shell_exec("DISPLAY=:99 /usr/local/bin/phantomjs --web-security=no run_qunit.js ".$url." ".$type);
	echo $value;
}

?>
