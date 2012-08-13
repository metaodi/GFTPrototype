<?php
require_once 'FTOAuthServiceAccount.class.php';

// the iCal date format
const DATE_ICAL = 'Ymd\THis\Z';
const DATE_ICAL_SHORT = 'Ymd';

//Get data from Google Fusion Tables
$auth = new FTOAuthServiceAccount("GFTCalendar");
$service = $auth->getFTService();
$selectQuery = "select rowid, Text, Date, Location, Number from 1AwxQ46kfmPoYoq38e5CopJOWkCo_9GUU_ucD6zI";
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
	$text = $row[array_search('Text', $cols)];
	$location = $row[array_search('Location', $cols)];
	$number = $row[array_search('Number', $cols)];
	$startDate = new DateTime($row[array_search('Date', $cols)]);
	$endDate = clone $startDate;
	$endDate->add(DateInterval::createFromDateString('1 day'));
	$now = new DateTime();
	
	$ical .= "BEGIN:VEVENT\r\n";
	$ical .= "SUMMARY:" . $text . "\r\n";
	$ical .= "UID:" . $rowid . "\r\n";
	$ical .= "STATUS:CONFIRMED\r\n";
	$ical .= "DTSTART;VALUE=DATE:" . $startDate->format(DATE_ICAL_SHORT) . "\r\n";
	$ical .= "DTEND;VALUE=DATE:" . $endDate->format(DATE_ICAL_SHORT) . "\r\n";
	$ical .= "DTSTAMP:" . $now->format(DATE_ICAL) . "\r\n";
	$ical .= "LAST-MODIFIED:" . $now->format(DATE_ICAL) . "\r\n";
	$ical .= "LOCATION:" . $location . "\r\n";
	$ical .= "DESCRIPTION:" . $text . " (" . $number . ")\r\n";
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
