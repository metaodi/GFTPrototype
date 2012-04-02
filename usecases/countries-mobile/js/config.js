var global = this;

$('#mapPage').live('pageinit', function(event){
	// configuring jquery mobile
	$.mobile.defaultPageTransition = 'slide';
	$.mobile.touchOverflowEnabled = true;
	
	// types are dynamically filled by reading data of table
	$.types = {};
	
	$.config = {
		icon: {
			phone: {
				57: './images/app-icon_countires_72px.png',
				72: './images/app-icon_countires_72px.png',
				114: './images/app-icon_countires_114px.png'
			}
		},
		glossOnIcon: true,
		startupScreen: {
			phone: ''
		},
		statusBarStyle: 'black',
		
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
	
	$.layerStyles = [];
	
	// create layer styles
	$.each($.config.colors, function(val, text) {
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
	
	$.fusiontable = {
		id: 3378569,
		field: 'geometry',
		styleConditions: {
			'SP.POP.TOTL': {
				low: 5000000,
				medium: 50000000,
				high: 100000000
			}
		},
		styles: $.layerStyles,
		typeField: {
			id: 'Indicator Code',
			name: 'Indicator Name'
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