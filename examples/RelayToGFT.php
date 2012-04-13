<?php
require_once(dirname(__FILE__) . '/../classes/PostRelay.class.php');

$url = "http://www.google.com/fusiontables/api/query";

$relay = new PostRelay($url);
echo $relay->relay();

?>
