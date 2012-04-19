<?php
include_once "../lib/oauth-php/library/OAuthStore.php";
include_once "../lib/oauth-php/library/OAuthRequester.php";

define("GOOGLE_OAUTH_HOST", "https://www.google.com");
define("GOOGLE_REQUEST_TOKEN_URL", GOOGLE_OAUTH_HOST . "/accounts/OAuthGetRequestToken");
define("GOOGLE_AUTHORIZE_URL", GOOGLE_OAUTH_HOST . "/accounts/OAuthAuthorizeToken");
define("GOOGLE_ACCESS_TOKEN_URL", GOOGLE_OAUTH_HOST . "/accounts/OAuthGetAccessToken");


define("FT_CLIENT_ID", '63601791805.apps.googleusercontent.com');
define("FT_CLIENT_SECRET", 'zXecWaIcjX66lksIEAzAam23');
define("FT_API_KEY",  'AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME');
define("FT_SCOPE",  'https://www.googleapis.com/auth/fusiontables');

$options = array('consumer_key' => FT_CLIENT_ID, 'consumer_secret' => FT_CLIENT_SECRET);
OAuthStore::instance("2Leg", $options);

$method = "GET";
$params = array(
	"scope" => FT_SCOPE
);

try
{
	// Obtain a request object for the request we want to make
	$request = new OAuthRequester(GOOGLE_REQUEST_TOKEN_URL, $method, $params);

	// Sign the request, perform a curl request and return the results, 
	// throws OAuthException2 exception on an error
	// $result is an array of the form: array ('code'=>int, 'headers'=>array(), 'body'=>string)
	$result = $request->doRequest();
	$response = $result['body'];
	
	 parse_str($response, $parsed_response);
	 
	 /*
	 $accessTokenReq = new OAuthRequester(GOOGLE_ACCESS_TOKEN_URL, $method, $params);
	 $result = $accessTokenReq->doRequest();
	 $tokenResp = $result['body'];
	 
	 parse_str($tokenResp, $parsedTokenResp);
	  */
	
	//OAuthRequester::requestAccessToken(GOOGLE_CONSUMER_KEY, $oauthToken, 0, 'POST', $_GET);
	
	echo json_encode($parsed_response);
}
catch(OAuthException2 $e)
{
	echo json_encode($e);
}
?>
