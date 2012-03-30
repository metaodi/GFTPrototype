<?php
require_once("RemoteException.class.php");

abstract class Relay {
	protected $curlHandler;
	protected $url;
	protected $data = null;

	public function __construct($url,$data) {
		$this->url  = $url;
		$this->data = $data;
	}
	
	protected function getData() {
		if (is_array($this->data) === true) {
			return http_build_query($this->data, '', '&');
		}
		return $this->data == null ? "" : $this->data;
	}
	
	public function getUrl() {
		$data = $this->getData();
		return ($data != "") ? $this->url."?".$data : $this->url;
	}

	public function relay()
	{
		$url = $this->getUrl();
		$this->curlHandler = curl_init($url);
		$this->beforeCall();
		curl_setopt($this->curlHandler, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($this->curlHandler, CURLOPT_TIMEOUT, 30);
		curl_setopt($this->curlHandler, CURLOPT_FOLLOWLOCATION, 1);
		
		$remote_answer = curl_exec($this->curlHandler);

		if(curl_errno($this->curlHandler) != 0) {
			$msgErrorNo = "cURL Errornumber: ".curl_errno($this->curlHandler);
			$msgError = "cURL Error: ".curl_error($this->curlHandler);
			throw new RemoteException($url,$msgErrorNo." ".$msgError);
		}
		return $remote_answer;
	}
	
	abstract protected function beforeCall();
}

?>
