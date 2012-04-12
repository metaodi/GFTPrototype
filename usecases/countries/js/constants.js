$(document).ready(function() {
	$.constants = {
		minYear: 1960,
		maxYear: 2010
	}
	
	$.infoWindowTemplate = 
		'<div class="gmap-info-window" style="font-family:sans-serif">' +
		'	<h1 class="country">###COUNTRY###</h1>' +
		'	<dl class="info">' +
		'		<dt>Year:</dt>' +
		'		<dd>###YEAR###</dd>' +
		'		<dt>###LAYERTITLE###:</dt>' +
		'		<dd>###LAYERVALUE###</dd>' +
		'		<dt>Difference to previous year:</dt>' +
		'		<dd>###DIFFERENCEPREVIOUSYEAR###</dd>' +
		'	</dl>' +
		'</div>';
	
	$.layerStyles = [
		{
			id: 'veryhigh',
			polygonOptions: {
				fillColor: "#ff0000",
				strokeColor: "#ff0000",
				strokeWeight: 1,
				fillOpacity: 0.3
			}
		},
		{
			id: 'high',
			polygonOptions: {
				fillColor: "#ff9900",
				strokeColor: "#ff9900",
				strokeWeight: 1,
				fillOpacity: 0.3
			}
		},
		{
			id: 'medium',
			polygonOptions: {
				fillColor: "#ffff00",
				strokeColor: "#ffff00",
				strokeWeight: 1,
				fillOpacity: 0.3
			}
		},
		{
			id: 'low',
			polygonOptions: {
				fillColor: "#ffffcc",
				strokeColor: "#ffffcc",
				strokeWeight: 1,
				fillOpacity: 0.3
			}
		},
		{
			id: 'nodata',
			polygonOptions: {
				fillColor: "#ffffff",
				strokeColor: "#ebebeb",
				strokeWeight: 1,
				fillOpacity: 0.3
			}
		}
	];
});

function hex2rgb(hex, opacity) {
	var rgb = hex.replace('#', '').match(/(.{2})/g);
	var i = 3;
	
	while (i--) {
		rgb[i] = parseInt(rgb[i], 16);
	}
	if (typeof opacity == 'undefined') {
		return 'rgb(' + rgb.join(', ') + ')';
	}

	return 'rgba(' + rgb.join(', ') + ', ' + opacity + ')';
}

function formatNumber(number, thousandSeparator) {
	var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
	number = number.toString();
	
	if(!thousandSeparator) {
		thousandSeparator = '\'';
	}
	
	while(sRegExp.test(number)) {
		number = number.replace(sRegExp, '$1' + thousandSeparator + '$2');
	}
	return number;
}

function round(zahl, n_stelle){
   n_stelle = (n_stelle == "" || n_stelle == 0 ? 1 : Math.pow(10, n_stelle));
   
   zahl = Math.round(zahl * n_stelle) / n_stelle;
   
   return zahl;
}

function loadPageInDiv(pageName,targetDivId,callback) {
	//retrive path and remove filename
	var pathArray = window.location.pathname.split('/');
	pathArray.pop();
	var pathname = pathArray.join('/');

	$.get(pathname+"/"+pageName+".html",function(data){
		$("#"+targetDivId).html(data);
		if(typeof callback == 'function') { 
			callback();
		} else if(pageName == 'map') {
			loadMap();
		}
	});
}