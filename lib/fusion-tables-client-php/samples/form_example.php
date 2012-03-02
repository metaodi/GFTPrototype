<html>

<?php

//include the files from the PHP FT client library
include('fusion-tables-client-php/clientlogin.php');
include('fusion-tables-client-php/sql.php');
include('fusion-tables-client-php/file.php');

// Table id
$tableid = 750563;

//Enter your username and password
$username = "username";
$password = "password";

// Get auth token - it would be better to save the token in a secure database
// rather than requesting it with every page load.
$token = ClientLogin::getAuthToken($username, $password);
$ftclient = new FTClientLogin($token);

// If the request is a post, insert the data into the table
if($_SERVER['REQUEST_METHOD'] == 'POST') {
  // Insert form data into table
  $insertresults = $ftclient->query(SQLBuilder::insert($tableid, 
    array('Name'=> $_POST['name'],
    'Value' => $_POST['result'],
    'Location' => $_POST['location'],
    'Timestamp' => time())));
  $insertresults = explode("\n", $insertresults);
  $rowid1 = $insertresults[1];
}

?>

<head>
<title>Simple Form Example</title>

<style>
  body { font-family: Arial, sans-serif; }
  #map_canvas { height: 300px; width:400px; }
</style>

<!-- Import Google Maps API JavaScript -->
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script> 
<script type="text/javascript">

var map;
var marker;

// Simple form checking.
function check_form() {
  if(document.getElementById('name').value == '' ||
    document.getElementById('result').value == '' ||
    document.getElementById('location').value == '') {
      
      alert('Name, result, and location required.');
      return false;
  } 
  return true;
}

function initialize() {
  // Initialize the Google Map
  map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: new google.maps.LatLng(37.5, -122.2),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  
  //Add a click listener to listen for clicks on the map
  google.maps.event.addListener(map, 'click', function(e) {
    alert('You clicked lat,lng: ' + e.latLng.lat() + ',' + e.latLng.lng());
    // The following line sets the value of the hidden location input
    // This field will be submitted along with the other form inputs
    if(marker == null) { 
      marker = new google.maps.Marker({
        map: map
      });
    }
    marker.setPosition(e.latLng);
    document.getElementById('location').value = e.latLng.lat() + ',' + e.latLng.lng();
  });
}

</script>
</head>

<body onload="initialize();">

<h1>Simple Form Example</h1>

<h2>Insert data</h2>
<form method="post" action="form_example.php" onsubmit="return check_form();">
  Name: <input type="text" name="name" id="name" /><br />
  Result: <input type="text" name="result" id="result" /><br />
  <!-- Create the map here -->
  <div id="map_canvas"></div>
  <!-- Hidden input field for location selected on map -->
  <input type="hidden" name="location" id="location" />
  <input type="submit" value="Submit" />
</form>

<h2>Table data</h2>
<p>
<?php
// Show the data from table
$table_data = $ftclient->query(SQLBuilder::select($tableid));
$table_data = explode("\n", $table_data);
for($i = 0; $i < count($table_data); $i++) {
  echo $table_data[$i] . '<br />';
} 
?>
</p>
</body>
</html>
