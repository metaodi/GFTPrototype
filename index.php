<?php

// Configurion examples
$examplesArr = Array(
	'js' => Array(
		'data-print' => Array(
			'title' => 'Select data',
			'tags' => Array(
				'sqlapi' => 'GFT SQL API'
			)
		),
		'spatialquery-condition' => Array(
			'title' => 'Select data with a spatial condition',
			'tags' => Array(
				'sqlapi' => 'GFT SQL API'
			)
		),
		'spatialquery-order' => Array(
			'title' => 'Select data with a spatial condition in order clause',
			'tags' => Array(
				'sqlapi' => 'GFT SQL API'
			)
		),
		'gmap-rawdata' => Array(
			'title' => 'Show raw data',
			'tags' => Array(
				'gmap' => 'Google Maps API'
			)
		),
		'gmap-geocoding' => Array(
			'title' => 'Show raw data with geocoding',
			'tags' => Array(
				'gmap' => 'Google Maps API',
				'sqlapi' => 'GFT SQL API'
			)
		),
		'gmap-fusiontableslayer' => Array(
			'title' => 'FusionTablesLayer',
			'tags' => Array(
				'gmap' => 'Google Maps API',
				'fusiontableslayer' => 'Google Maps FusionTablesLayer'
			)
		),
		'gmap-dynamic-fusiontableslayer' => Array(
			'title' => 'Dynamic FusionTablesLayer',
			'tags' => Array(
				'gmap' => 'Google Maps API',
				'fusiontableslayer' => 'Google Maps FusionTablesLayer'
			)
		),
		'gmap-spatialquery' => Array(
			'title' => 'Google Maps with Spatial condition',
			'tags' => Array(
				'gmap' => 'Google Maps API',
				'fusiontableslayer' => 'Google Maps FusionTablesLayer'
			)
		),
		'gchart-fusiontable' => Array(
			'title' => 'Google Chart Tool with Fusion Table data',
			'tags' => Array(
				'gchart' => 'Google Chart Tool'
			)
		),
		'oauth-login' => Array(
			'title' => 'Inserting data to Fusion Table with OAuth',
			'tags' => Array(
				'oauth' => 'OAuth 2'
			)
		),
		'senchatouch-fusiontableslayer' => Array(
			'title' => 'FusionTablesLayer used in Sencha Touch 2 Application',
			'tags' => Array(
				'gmap' => 'Google Maps API',
				'fusiontableslayer' => 'Google Maps FusionTablesLayer',
				'st2' => 'Sencha Touch 2.0'
			)
		)
	)
);
?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>GFTPrototype</title>
    <link rel="stylesheet" href="./resources/styles/styles.css" type="text/css">
</head>
<body>
	<h1 class="page-header">GFTPrototype</h1>
	<div id="box">
		
		<h2>Examples</h2>
		<h3>JavaScript</h3>
		<div class="part-body">
			<ul id="examples">
			<?php
				foreach($examplesArr['js'] as $exampleJsKey => $examplesJsValue) {
					$content = '';
					$content .= '<li><div class="title"><a href="./examples/js/'. $exampleJsKey.'">'.$examplesJsValue['title'].'</a></div>';
					$content .= '<ul class="tags">';
					foreach($examplesJsValue['tags'] as $exampleJsTagKey => $examplesJsTagValue) {
						$content .= '<li class="'.$exampleJsTagKey.'">'.$examplesJsTagValue.'</li>';
					}
					$content .= '</ul>';
					$content .= '</li>';
					echo $content;
				}
			?>
			</ul>
		</div>
		
		<h2>UseCases</h2>
		<h3>WorldData</h3>
		<div class="part-body">
			<dl class="description">
				<dt>Beschreibung:</dt>
				<dd>WorldData zeigt grosse Datenmengen aus einer FusionTable via FusionTablesLayer der Google Maps API an.</dd>
				<dt>Techonologie:</dt>
				<dd>JavaScript (jQuery Mobile verwendet), HTML</dd>
				<dt>Voraussetzungen:</dt>
				<dd>Diese Applikation läuft auf allen gängigen Browsern. Eine vollständige Liste mit den unterstützten Browsern findet man hier: <a href="http://jquerymobile.com/gbs/" target="_blank">jQuery Mobile Supported Platforms</a></dd>
			</dl>
			<p><a href="./usecases/worlddata" class="app-start">Applikation jetzt starten</a></p>
		</div>
		
		<h3>FixMyStreet</h3>
		<div class="part-body">
			<dl class="description">
				<dt>Beschreibung:</dt>
				<dd>Mit FixMyStreet können Bürger Defekte (Strassenlampen, Schlaglöcher, etc.) per Handy an ihre Gemeinde melden.</dd>
				<dt>Techonologie:</dt>
				<dd>JavaScript (Sencha Touch 2.0 verwendet)</dd>
				<dt>Voraussetzungen:</dt>
				<dd>Diese Applikation läuft auf allen WebKit-Browsern (Desktop: Chrome, Opera, Safari / Mobile: iOS, Android, Blackberry)</dd>
			</dl>
			<p><a href="./usecases/worlddata" class="app-start">Applikation jetzt starten</a></p>
		</div>
	</div>
</body>
</html>
