$('#mapPage').live('pageinit', function(event){
	$.constants = {
		minYear: 1960,
		maxYear: 2010,
		
		colors: {
			veryhigh: {
				fillColor: "#ff0000",
				strokeColor: "#ff0000"
			},
			high: {
				fillColor: "#ff9900",
				strokeColor: "#ff9900"
			},
			medium: {
				fillColor: "#ffff00",
				strokeColor: "#ffff00"
			},
			low: {
				fillColor: "#ffffcc",
				strokeColor: "#ffffcc"
			},
			nodata: {
				fillColor: "#ffffff",
				strokeColor: "#ebebeb"
			}
		}
	}
	
	$.infoWindowTemplate = 
		'<div class="gmap-info-window" style="font-family:sans-serif">' +
		'	<h1 class="country">###COUNTRY###</h1>' +
		'	<dl class="info">' +
		'		<dt>Jahr:</dt>' +
		'		<dd>###YEAR###</dd>' +
		'		<dt>###LAYERTITLE###:</dt>' +
		'		<dd>###LAYERVALUE###</dd>' +
		'		<dt>Differenz zum Vorjahr:</dt>' +
		'		<dd>###DIFFERENCEPREVIOUSYEAR###</dd>' +
		'	</dl>' +
		'</div>';
	
	$.layerStyles = Array();
	
	// create layer styles
	$.each($.constants.colors, function(val, text) {
		/*$.layerStyles[val.toString()] = {
			id: val.toString(),
			polygonOptions: {
				fillColor: text.fillColor,
				strokeColor: text.strokeColor,
				strokeWeight: 1,
				fillOpacity: 0.3
			}
		}*/
		$.layerStyles.push({
			id: val.toString(),
			polygonOptions: {
				fillColor: text.fillColor,
				strokeColor: text.strokeColor,
				strokeWeight: 1,
				fillOpacity: 0.3
			}
		});
	});
	
	$.fusiontables = {
		3378569: {
			name: 'Einwohner',
			field: 'geometry',
			styleConditions: {
				low: 5000000,
				medium: 50000000,
				high: 100000000
			},
			styles: $.layerStyles
		}
	};
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