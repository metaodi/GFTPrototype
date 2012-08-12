<?php

require_once '../../lib/google-api-php-client/src/Google_Client.php';
require_once '../../lib/google-api-php-client/src/contrib/Google_FusiontablesService.php';

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


$service = new Google_FusiontablesService($client);

$number = rand(1,100);
$updateQuery = "update 1AwxQ46kfmPoYoq38e5CopJOWkCo_9GUU_ucD6zI set Number = '".$number."' where rowid = '1'";

echo "<p><strong>SQL</strong>: ".$updateQuery."</p>";

echo "<pre>";
print_r($service->query->sql($updateQuery));

$selectQuery = "select * from 1AwxQ46kfmPoYoq38e5CopJOWkCo_9GUU_ucD6zI where rowid = '1'";
print_r($service->query->sql($selectQuery));
echo "</pre>";


?>
