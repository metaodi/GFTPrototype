<?php
require_once 'FTOAuthServiceAccount.class.php';

// the iCal date format
const DATE_ICAL = 'Ymd\THis\Z';
const DATE_ICAL_SHORT = 'Ymd';

//Get data from Google Fusion Tables
$auth = new FTOAuthServiceAccount("Install Calendar");
$service = $auth->getFTService();
$selectQuery = "select rowid, 'First Name' as first_name, 'Last Name' as last_name,'2012 Larry estimated job hrs' as estimated_hours, '2012 Installer' as installer,'2012 Job scheduled Date' as scheduled_date,'2012 Appointment Timing Requests' as time_request,'Hood' as hood,'More than one installation location' as multiple_locations from 1HJ33ld6svRn8MQxE71R3a2YKeUNf0TjWpH6xZC8";
$result = $service->query->sql($selectQuery);

$rows = $result['rows'];
$cols = $result['columns'];

$ical  = "BEGIN:VCALENDAR\r\n";
$ical .= "METHOD:PUBLISH\r\n";
$ical .= "VERSION:2.0\r\n";
$ical .= "PRODID:-//Stefan Oderbolz//GFTCalendar//EN\r\n";
 
foreach ($rows as $row) 
{
	$rowid = $row[array_search('rowid', $cols)];
	$client_name = $row[array_search('first_name', $cols)] . " " . $row[array_search('last_name', $cols)];
	$estimated_hours = $row[array_search('estimated_hours', $cols)];
	$installer = $row[array_search('installer', $cols)];
	$hood = $row[array_search('hood', $cols)];
	$multiple_locations = $row[array_search('multiple_locations', $cols)];
	
	$time = "";
	//$time = $row[array_search('time_request', $cols)];
	//echo $row[array_search('scheduled_date', $cols)] + " " + $time;
	$startDate = new DateTime($row[array_search('scheduled_date', $cols)]);
	$endDate = clone $startDate;
	$now = new DateTime();
	
	$ical .= "BEGIN:VEVENT\r\n";
	$ical .= "SUMMARY: Installation at " . $client_name . "\r\n";
	$ical .= "UID:" . $rowid . "\r\n";
	$ical .= "STATUS:CONFIRMED\r\n";
	
	if ($time == "") {
		$endDate->add(DateInterval::createFromDateString('1 day'));
		$ical .= "DTSTART;VALUE=DATE:" . $startDate->format(DATE_ICAL_SHORT) . "\r\n";
		$ical .= "DTEND;VALUE=DATE:" . $endDate->format(DATE_ICAL_SHORT) . "\r\n";
	}
	else
	{
		$estimated_hours = ($estimated_hours != "") ? $estimated_hours : 1;
		$endDate->add(DateInterval::createFromDateString($estimated_hours . " hours"));
		$ical .= "DTSTART:" . $startDate->format(DATE_ICAL) . "\r\n";
		$ical .= "DTEND:" . $endDate->format(DATE_ICAL) . "\r\n";
	}
	$ical .= "DTSTAMP:" . $now->format(DATE_ICAL) . "\r\n";
	$ical .= "LAST-MODIFIED:" . $now->format(DATE_ICAL) . "\r\n";
	$ical .= "LOCATION:" . $hood . "\r\n";
	$ical .= "DESCRIPTION:installer: " . $installer . ", estimated hours:" . $estimated_hours . ", multiple locations: " . $multiple_locations . "\r\n";
	$ical .= "END:VEVENT\r\n";
}
 
// close calendar
$ical .= "END:VCALENDAR";

//set correct content-type-header
if (isset($_GET['debug'])) 
{
	echo "<pre>" . $ical . "</pre>";
} 
else 
{
	header('Content-type: text/calendar; charset=utf-8');
	header('Content-Disposition: inline; filename=gft_calendar.ics');
	echo $ical;
	exit;
}
?>
