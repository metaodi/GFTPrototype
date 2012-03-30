<?php
require_once('Relay.class.php');

class GetRelay extends Relay {
	protected function beforeCall()
	{
		curl_setopt($this->curlHandler, CURLOPT_HTTPGET, true);
	}
}

?>