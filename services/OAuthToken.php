<?php
require_once '../lib/google-api-php-client/src/Google_Client.php';

function generate_jsonp($jsonString,$functionName="callback") 
{
	return $functionName."(".$jsonString.");";
}

/* Define all constants */
const CLIENT_ID = '63601791805-gd5vj9a4pu177krdm9fu5rfhulkcl2bl.apps.googleusercontent.com';
const FT_SCOPE = 'https://www.googleapis.com/auth/fusiontables';
const SERVICE_ACCOUNT_NAME = '63601791805-gd5vj9a4pu177krdm9fu5rfhulkcl2bl@developer.gserviceaccount.com';
const KEY_FILE = '/var/www/2cb665b201d20418fd491a37292a7d3cd8b57450-privatekey.p12';

$client = new Google_Client();
$client->setApplicationName("GFTPrototype");
$client->setClientId(CLIENT_ID);

//add key
$key = file_get_contents(KEY_FILE);
$client->setAssertionCredentials(new Google_AssertionCredentials(
    SERVICE_ACCOUNT_NAME,
    array(FT_SCOPE),
    $key)
);

//reuse key if it's saved in the session
session_start();
$expired = false;
if (isset($_SESSION['token'])) 
{
	$client->setAccessToken($_SESSION['token']);
	$accessToken = json_decode($client->getAccessToken());
	if (($accessToken->created + ($accessToken->expires_in - 30)) < time()) 
	{
		$expired = true;
	}
} 

if (!isset($_SESSION['token']) || $expired)
{
	$client::$auth->refreshTokenWithAssertion();
}

if ($client->getAccessToken()) 
{
	if (isset ($_GET['jsonp']) && $_GET['jsonp'] != "") 
	{
		print generate_jsonp($client->getAccessToken(),$_GET['jsonp']);
	}
	else 
	{
		print $client->getAccessToken();
	}

	//save to key for the session
	$_SESSION['token'] = $client->getAccessToken();
}
?>