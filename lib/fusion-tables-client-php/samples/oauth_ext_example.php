<?php

session_start();

include('../oauth_ext.php');
include('../sql.php');

          						 
if(empty($_GET["oauth_token"])) {
  $results = OAuthClientExt::getAuthURL("myconsumerkey", 
						                     "myconsumersecret",
						                     "http://mydomain.com/samples/oauth_ext_example.php");
	
	//you'll probably want to use a database to save the token and secret
	//rather than the Session variables as shown here					                     
	$_SESSION['token'] = $results["request_token"];
	$_SESSION['secret'] = $results["request_secret"];
		
  header($results['url']);
  
} else {

  $results = OAuthClientExt::authorize("myconsumerkey", 
						                     "myconsumersecret",
		                             $_SESSION['token'],
		                             $_SESSION['secret']);
  
  $oauthClient = new FTOAuthClientExt("myconsumerkey", 
						                     "myconsumersecret",
			                           $results['access_token'],
			                           $results['access_secret']);
				            
	echo $oauthClient->query(SQLBuilder::showTables());		
	echo $oauthClient->query(SQLBuilder::select(197026));	  
  
}

?>
