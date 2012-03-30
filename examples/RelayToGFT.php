<?php
require_once(dirname(__FILE__) . '/../classes/GetRelay.class.php');
require_once(dirname(__FILE__) . '/../classes/PostRelay.class.php');

$url = "http://www.google.com/fusiontables/api/query";
/*
if (count($_POST) > 0) {
	$relay = new PostRelay($url,$_POST);
} else {
	$relay = new GetRelay($url,$_GET);
}
 */
$relay = new PostRelay($url,$_POST);
echo $relay->relay();

?>
