<?php
require_once 'FTOAuthServiceAccount.class.php';

// the iCal date format
const DATE_ICAL = 'Ymd\THis\Z';

//Get data from Google Fusion Tables
$auth = new FTOAuthServiceAccount("GFTCalendar");
$service = $auth->getFTService();
$selectQuery = "select rowid, Text, Date, Location, Number from 1AwxQ46kfmPoYoq38e5CopJOWkCo_9GUU_ucD6zI";
$result = $service->query->sql($selectQuery);

$rows = $result['rows'];
$cols = $result['columns'];

$ical = "BEGIN:VCALENDAR
METHOD:PUBLISH
VERSION:2.0
PRODID:-//Stefan Oderbolz//GFTCalendar//EN\n";
 
foreach ($rows as $row) 
{
	$rowid = $row[array_search('rowid', $cols)];
	$text = $row[array_search('Text', $cols)];
	$location = $row[array_search('Location', $cols)];
	$number = $row[array_search('Number', $cols)];
	$startDate = new DateTime($row[array_search('Date', $cols)]);
	$endDate = $startDate->add(DateInterval::createFromDateString('1 day'));
	
	$ical .= "BEGIN:VEVENT\n";
	$ical .= "SUMMARY:" . $text . "\n";
	$ical .= "UID:" . $rowid . "\n";
	$ical .= "STATUS:CONFIRMED\n";
	$ical .= "DTSTART:" . $startDate->format(DATE_ICAL) . "\n";
	$ical .= "DTEND:" . $endDate->format(DATE_ICAL) . "\n";
	$ical .= "LOCATION:" . $location . "\n";
	$ical .= "SUMMARY:" . $text . " (" . $number . ")\n";
	$ical .= "END:VEVENT\n";
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
