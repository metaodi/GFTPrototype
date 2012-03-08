<?php
$allowed_values = array("text", "junit-xml");
$type = "text";
if (isset($_GET['type'])) {
	$type = $_GET['type'];
}

if (!in_array($type,$allowed_values)) {
	exit(1);
} else {
	/* Display 99 is configured on the server using Xvfb */
	$value = shell_exec("DISPLAY=:99 phantomjs run_qunit.js http://gft.rdmr.ch/test/js/index.html ".$type);
	echo $value;
}

?>
