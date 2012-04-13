<?php
require_once(dirname(__FILE__) . '/../classes/PostRelay.class.php');

$url = "https://www.googleapis.com/fusiontables/v1/query";

if(count($_GET) > 0) {
	$relay = new PostRelay($url,$_GET);
} else {
	$relay = new PostRelay($url);
}
echo $relay->relay();

?>
