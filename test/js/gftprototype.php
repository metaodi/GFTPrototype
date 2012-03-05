<?php
/* Display 99 is configured on the server using Xvfb */
$type = "";
if (isset($_GET['type'])) {
	$type = $_GET['type'];
}
$value = shell_exec("DISPLAY=:99 phantomjs run_qunit.js http://gft.rdmr.ch/test/js/index.html ".$type);
echo $value;

?>