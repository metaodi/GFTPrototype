<?php
$value = shell_exec('DISPLAY=:99 phantomjs run_qunit.js http://gft.rdmr.ch/test/js/index.html');

/*
Possible output: 
'waitFor()' finished in 2021ms.
Tests completed in 1926 milliseconds.
22 tests of 22 passed, 0 failed.
 */

$lines = explode ("\n", $value);
$timestamp = date("c");

if (count($lines) >= 3) {
	preg_match("Tests completed in (\d*) milliseconds.", $lines[1], $timeRe);
	$time = $timeRe / 1000;
	
	preg_match("(\d*) tests of (\d*) passed, (\d*) failed.", $lines[2], $testRe);
	$tests = $testRe[2];
	$failures = $testRe[3];
	
	
	echo "<?xml version=\"1.0\"?>\n";
	
	echo "<!--\n";
	echo $value;
	echo "-->\n\n"; 
	
	echo "<testsuite name=\"GFTPrototype - JavaScript Tests\" timestamp=\"".$timestamp."\" hostname=\"localhost\" tests=\"".$tests."\" failures=\"".$failures."\" errors=\"0\" time=\"".$time."\">\n";
	echo "<testcase name=\"phantomjs.tests\" classname=\"GFTPrototype - JavaScript Tests\" time=\"".$time."\"/>\n";
	echo "</testsuite>\n";
} else {
	echo $value;
}
?>