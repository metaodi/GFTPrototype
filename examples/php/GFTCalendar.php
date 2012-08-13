<?php
require_once 'FTOAuthServiceAccount.class.php';
$auth = new FTOAuthServiceAccount("GFTCalendar");
$service = $auth->getFTService();

$selectQuery = "select rowid, Text, Date, Location, Number from 1AwxQ46kfmPoYoq38e5CopJOWkCo_9GUU_ucD6zI";
$result = $service->query->sql($selectQuery);

$rows = $result['rows'];
$cols = $result['columns'];
 
// the iCal date format
const DATE_ICAL = 'Ymd\THis\Z';
 
$ical = "BEGIN:VCALENDAR
METHOD:PUBLISH
VERSION:2.0
PRODID:-//Stefan Oderbolz//GFTCalendar//EN\n";
 
// loop over events
foreach ($rows as $row) 
{
	$ical .= "BEGIN:VEVENT\n";
	$ical .= "SUMMARY:" . $row[array_search('Text', $cols)] . "\n";
	$ical .= "UID:" . $row[array_search('rowid', $cols)] . "\n";
	$ical .= "STATUS:CONFIRMED\n";
	$ical .= "DTSTART:" . date(DATE_ICAL, strtotime($row[array_search('Date', $cols)])) . "\n";
	$ical .= "DTEND:" . date(DATE_ICAL, strtotime($row[array_search('Date', $cols)])) . "\n";
	//$ical .= "LAST-MODIFIED:" . date(DATE_ICAL, strtotime($row[array_search('Last modified', $cols)])) . "\n";
	$ical .= "LOCATION:" . $row[array_search('Location', $cols)] . "\n";
	$ical .= "END:VEVENT\n";
}
 
// close calendar
$ical .= "END:VCALENDAR";

//set correct content-type-header
header('Content-type: text/calendar; charset=utf-8');
header('Content-Disposition: inline; filename=gft_calendar.ics');
echo $ical;
exit;
?>
