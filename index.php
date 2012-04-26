<?php

// Configurion examples
$examplesArr = Array(
	'js' => Array(
		'data-print' => Array(
			'title' => 'Select data',
			'tags' => Array(
				'sqlapi'
			),
			'fusiontables' => Array(
				'Schweizer Städte'
			)
		),
		'spatialquery-condition' => Array(
			'title' => 'Select data with a spatial condition',
			'tags' => Array(
				'sqlapi'
			),
			'fusiontables' => Array(
				'Schweizer Städte'
			)
		),
		'spatialquery-order' => Array(
			'title' => 'Select data with a spatial condition in order clause',
			'tags' => Array(
				'sqlapi'
			),
			'fusiontables' => Array(
				'Schweizer Städte'
			)
		),
		'gmap-rawdata' => Array(
			'title' => 'Show raw data',
			'tags' => Array(
				'gmap'
			),
			'fusiontables' => Array(
				'Schweizer Städte'
			)
		),
		'gmap-geocoding' => Array(
			'title' => 'Show raw data with geocoding',
			'tags' => Array(
				'gmap',
				'sqlapi'
			),
			'fusiontables' => Array(
				'Schweizer Städte'
			)
		),
		'gmap-fusiontableslayer' => Array(
			'title' => 'FusionTablesLayer',
			'tags' => Array(
				'gmap',
				'fusiontableslayer'
			),
			'fusiontables' => Array(
				'Schweizer Städte',
				'Coin'
			)
		),
		'gmap-dynamic-fusiontableslayer' => Array(
			'title' => 'Dynamic FusionTablesLayer',
			'tags' => Array(
				'gmap',
				'fusiontableslayer'
			),
			'fusiontables' => Array(
				'Schweizer Städte',
				'Coin'
			)
		),
		'gmap-spatialquery' => Array(
			'title' => 'Google Maps with Spatial condition',
			'tags' => Array(
				'gmap',
				'fusiontableslayer'
			),
			'fusiontables' => Array(
				'Schweizer Städte'
			)
		),
		'gchart-fusiontable' => Array(
			'title' => 'Google Chart Tool with Fusion Table data',
			'tags' => Array(
				'gchart'
			),
			'fusiontables' => Array(
				'Schweizer Städte',
				'Chart Test Table'
			)
		),
		'oauth-login' => Array(
			'title' => 'Inserting data to Fusion Table with OAuth',
			'tags' => Array(
				'oauth'
			),
			'fusiontables' => Array(
				'Private'
			)
		),
		'senchatouch-fusiontableslayer' => Array(
			'title' => 'FusionTablesLayer used in Sencha Touch 2 Application',
			'tags' => Array(
				'gmap',
				'fusiontableslayer',
				'st2'
			),
			'fusiontables' => Array(
				'Schweizer Städte'
			)
		)
	)
);

$labelTitleMapping = Array(
	'fusiontableslayer' => 'Google Maps FusionTablesLayer',
	'gmap' => 'Google Maps API',
	'sqlapi' => 'Google Fusion Tables SQL API',
	'oauth' => 'OAuth 2',
	'gchart' => 'Google Chart Tool',
	'st2' => 'Sencha Touch 2.0',
	'jqm' => 'jQuery Mobile',
);
$labelColorMapping = Array(
	'fusiontableslayer' => 'info',
	'gmap' => 'important',
	'sqlapi' => 'success',
	'oauth' => 'warning',
	'gchart' => 'default',
	'st2' => 'default',
	'jqm' => 'default',
);

$fusiontableToUrlMapping = Array(
	'Schweizer Städte' => 'https://www.google.com/fusiontables/DataSource?docid=1LWXSMsZINyfjAKGqeS-822wi4WmlaGmmvh20Ujw',
	'Chart Test Table' => 'https://www.google.com/fusiontables/DataSource?docid=1R9FMod3LN7UO3R6jp7gJeSQ9hbEVOwLqF0AZFQg',
	'Coin' => 'https://www.google.com/fusiontables/DataSource?docid=1UflpL9f3WGrNdSPK4UAUHVAFdycZWu0_qnEPfAA'
);
?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>GFTPrototype</title>
	<link rel="icon" href="./resources/images/gftprototype-favicon.png" type="image/png" />

	<!-- twitter bootstrap -->
	<link href="./lib/bootstrap-2.0.2/css/bootstrap.css" rel="stylesheet">
	
	<link rel="stylesheet" href="./resources/styles/styles.css" type="text/css">
</head>
<body>
	<h1 class="page-header">GFTPrototype</h1>
	<div id="box">
		
		<h2 class="first">Examples</h2>
		<h3>JavaScript</h3>
		<ul id="examples">
		<?php
			$counter = 0;
			foreach($examplesArr['js'] as $exampleJsKey => $examplesJsValue) {
				if($counter % 2) {
					$content = '<li>';
				} else {
					$content = '<li class="odd">';
				}
				$content .= '<div class="title">';
				$content .= '<a href="./examples/js/'. $exampleJsKey.'">'.$examplesJsValue['title'].'</a>';
				$content .= '<span class="fusiontables">(Fusion Tables: ';
				$fusiontableCounter = 0;
				foreach($examplesJsValue['fusiontables'] as $fusiontableName) {
					++$fusiontableCounter;
					if($fusiontableName == 'Private') {
						$content .= 'Private Tabelle';
					} else {
						$content .= '<a href="'.$fusiontableToUrlMapping[$fusiontableName].'" target="_blank">'.$fusiontableName.'</a>';
					}
					if($fusiontableCounter < count($examplesJsValue['fusiontables'])) {
						$content .= ', ';
					}
				}
				$content .= ')';
				$content .= '</div>';
				foreach($examplesJsValue['tags'] as $examplesJsTagValue) {
					$content .= '<span class="label label-'.$labelColorMapping[$examplesJsTagValue].'">'.$labelTitleMapping[$examplesJsTagValue].'</span>';
				}
				$content .= '</li>';
				echo $content;
				++$counter;
			}
		?>
		</ul>
		<h3>Diverses</h3>
		<ul id="examples">
			<li class="odd"><a href="http://jenkins.rdmr.ch:8080/job/Import%20GIS%20files%20to%20GFT/">Geodaten Converter</a> (nur mit Login ausführbar)</li>
		</ul>
		
		<h2>UseCases</h2>
		<h3>WorldData</h3>
		<div class="part-body">
			<dl class="description">
				<dt>Beschreibung:</dt>
				<dd>WorldData zeigt grosse Datenmengen aus einer FusionTable via FusionTablesLayer der Google Maps API an.</dd>
				<dt>Techonologie:</dt>
				<dd>JavaScript (jQuery Mobile verwendet), HTML</dd>
				<dt>Fusion Tables:</dt>
				<dd>
					<ul class="fusiontables">
						<li><a href="https://www.google.com/fusiontables/DataSource?docid=1FYur7QKupz9UFDiTbAiIVGgsdbHUypzpHz2Iqb0" target="_blank">World Borders</a></li>
						<li><a href="https://www.google.com/fusiontables/DataSource?docid=1yjvHyay7uwBXprkAKZ4iBG4tZk87aWKCxiuBISs" target="_blank">World Data</a></li>
						<li><a href="https://www.google.com/fusiontables/DataSource?docid=1Ex_gdGfRST85LTD9JxCwhohXFtRKo0_ap9G6cEI" target="_blank">Merge der beiden Tabellen</a> (Join über Landesnamen)</li>
					</ul>
				</dd>
				<dt>Labels:</dt>
				<dd><span class="label label-normal">jQuery Mobile</span><span class="label label-info">Google Maps FusionTablesLayer</span><span class="label label-important">Google Maps API</span></dd>
				<dt>Voraussetzungen:</dt>
				<dd>Diese Applikation läuft auf allen gängigen Browsern. Eine vollständige Liste mit den unterstützten Browsern findet man hier: <a href="http://jquerymobile.com/gbs/" target="_blank">jQuery Mobile Supported Platforms</a></dd>
			</dl>
			<p class="app-start">
				<a href="./usecases/worlddata" class="btn btn-primary">Applikation starten</a>
			</p>
		</div>
		
		<h3>FixMyStreet</h3>
		<div class="part-body">
			<dl class="description">
				<dt>Beschreibung:</dt>
				<dd>Mit FixMyStreet können Bürger Defekte (Strassenlampen, Schlaglöcher, etc.) per Handy an ihre Gemeinde melden.</dd>
				<dt>Techonologie:</dt>
				<dd>JavaScript (Sencha Touch 2.0 verwendet)</dd>
				<dt>Fusion Tables:</dt>
				<dd>
					<ul class="fusiontables">
						<li><a href="https://www.google.com/fusiontables/DataSource?docid=1ggQAh0WF7J7myI27_Pv4anl0wBJQ7ERt4W5E6QQ" target="_blank">Gemeldete Probleme</a></li>
					</ul>
				</dd>
				<dt>Labels:</dt>
				<dd><span class="label label-normal">Sencha Touch 2.0</span><span class="label label-info">Google Maps FusionTablesLayer</span><span class="label label-important">Google Maps API</span></dd>
				<dt>Voraussetzungen:</dt>
				<dd>Diese Applikation läuft auf allen WebKit-Browsern (Desktop: Chrome, Opera, Safari / Mobile: iOS, Android, Blackberry)</dd>
			</dl>
			<p class="app-start">
				<a href="./usecases/fixmystreet" class="btn btn-primary">App starten</a>
				<a href="./usecases/fixmystreet/index_iphone.html" class="btn btn-info">App starten (iPhone Preview Mode)</a>
			</p>
		</div>
		
		<h2>Über das Projekt</h2>
		<div class="part-body">
			<dl class="description">
				<dt>Projekt:</dt>
				<dd>Studienarbeit FS2012</dd>
				<dt>Schule:</dt>
				<dd><a href="http://www.hsr.ch/" target="_blank">HSR Hochschule für Technik Rapperswil</a></dd>
				<dt>Autoren:</dt>
				<dd>Stefan Oderbolz</dd>
				<dd>Jürg Hunziker</dd>
				<dt>Betreuer:</dt>
				<dd>Stefan Keller</dd>
				<dt>Auftraggeber:</dt>
				<dd>Marco Lehmann, <a href="http://www.geoinfo.ch/" target="_blank">GEOINFO AG Herisau</a></dd>
				<dt>Repository:</dt>
				<dd><a href="https://github.com/odi86/GFTPrototype" target="_blank">https://github.com/odi86/GFTPrototype</a></dd>
				<dt>Projektmanagement:</dt>
				<dd><a href="http://redmine.rdmr.ch/redmine/projects/gftprototype" target="_blank">http://redmine.rdmr.ch/redmine/projects/gftprototype</a></dd>
				<dt>Continuous Integration:</dt>
				<dd><a href="http://jenkins.rdmr.ch:8080/job/GFTPrototype/" target="_blank">http://jenkins.rdmr.ch:8080/job/GFTPrototype/</a></dd>
				
			</dl>
		</div>
	</div>
</body>
</html>
