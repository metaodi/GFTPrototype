<html>

<?php

//include the files from the PHP FT client library
include('GFTClient.class.php');

// Table id
$tableid = 3106577;
$client = new GFTClient($tableid);

// If the request is a post, insert the data into the table
if($_SERVER['REQUEST_METHOD'] == 'POST') {
  // Insert form data into table
  $insertresults = $client->insert(
    array('Desc'=> $_POST['desc'],
    'Location' => $_POST['location']));
  print_r($insertresults);
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
  if(document.getElementById('desc').value == '' ||
    document.getElementById('location').value == '') {
      
      alert('Description and location required.');
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
    //alert('You clicked lat,lng: ' + e.latLng.lat() + ',' + e.latLng.lng());
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
	
<h2>Insert data</h2>
<form method="post" action="gft_example.php" onsubmit="return check_form();">
  Name: <input type="text" name="desc" id="desc" /><br />
  <!-- Create the map here -->
  <div id="map_canvas"></div>
  <!-- Hidden input field for location selected on map -->
  <input type="hidden" name="location" id="location" />
  <input type="submit" value="Submit" />
</form>

<h2>Table data</h2>
<pre>
<?php
// Show the data from table
$table_data = $client->select();
print_r($table_data);
?>
</pre>
</pre>
</body>
</html>
