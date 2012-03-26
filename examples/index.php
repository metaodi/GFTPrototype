<?php
function listDir($currentDir) {
	if($currentDir == "") {
		$currentDir = ".";
	}
	$dirArr = array();
	// Öffnen eines bekannten Verzeichnisses und danach seinen Inhalt einlesen
	if (is_dir($currentDir)) {
		if ($dh = opendir($currentDir)) {
			while (($file = readdir($dh)) !== false) {
				if(is_dir($currentDir.'/'.$file)) {
					if($file != '.') {
						$dirArr[] = $file;
					}
				} else {
					if($currentDir != '.' && ($file == 'index.html' || $file == 'index.php')) {
						// if index-file available redirect to page
						header("Location: ".$currentDir);
					}
				}
			}
			closedir($dh);
		}
	}
	
	foreach($dirArr as $dirname) {
		$diranchor = $currentDir.'/'.$dirname;
		if($dirname == '..') {
			$diranchor = substr($currentDir, 0, strrpos($currentDir, '/'));
			if($diranchor == '') {
				$diranchor = '.';
			}
		}
		echo '<li><a href="?dir='.$diranchor.'">/'.$dirname.'</a></li>';
	}
}

$currentDir = ".";
if(isset($_GET['dir'])) {
	if(preg_match("/^\.\//",$_GET['dir'])) {
		$currentDir = $_GET['dir'];
	}
}
?>
<!DOCTYPE html>
<html>
<head>
	<title>Google Fusion Table - Examples</title>
	<meta charset="utf-8">
</head>
<body>
	<h1>Google Fusion Table - Examples</h1>
	<p>Current Directory: <?php echo $currentDir; ?></p>
	<ul>
<?php
		listDir($currentDir);
?>
	</ul>
</body>
</html>
