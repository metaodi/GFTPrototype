<?php

include('../oauth.php');
include('../sql.php');
include('../file.php');


$extra_options = array('server' => 'localhost',
          						 'database' => 'mydatabase', 
          						 'username' => 'myusername', 
          						 'password' => 'mypassword');
          						 
$user_id = 1;
          						 
if(empty($_GET["oauth_token"])) {
  $url = OAuthClient::getAuthURL("myconsumerkey", 
						                     "myconsumersecret", 
						                     "MySQL", 
						                     $user_id,
						                     "http://mydomain.com/samples/oauth_example.php",
						                     $extra_options);
  header($url);
  
} else {

  $oauth_token = $_GET['oauth_token'];
  $verifier = $_GET['oauth_verifier'];
  
  OAuthClient::authorize("myconsumerkey", 
				                 "myconsumersecret", 
				                 $oauth_token,
				                 $verifier,
				                 "MySQL",
				                 $user_id,
				                 $extra_options);
  
  $oauthClient = new FTOAuthClient("myconsumerkey", 
						                       "myconsumersecret", 
				                           "MySQL",
				                           $user_id,
				                           $extra_options);
				            
	echo $oauthClient->query(SQLBuilder::showTables());		
	echo $oauthClient->query(SQLBuilder::select(197026));	            
  echo FileUploader::uploadCSV($oauthClient, "testcsv.csv");
  
}

?>
