<?php
require_once('Relay.class.php');

class PostRelay extends Relay {
	protected function beforeCall()
	{
		curl_setopt($this->curlHandler, CURLOPT_POST, true);
		if($this->data != null) {
			curl_setopt($this->curlHandler, CURLOPT_POSTFIELDS, $this->getData());
		}
	}
}

?>
