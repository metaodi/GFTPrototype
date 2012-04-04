var global = this;

$('#mapPage').live('pageinit', function(event){
	// configuring jquery mobile
	$.mobile.defaultPageTransition = 'slide';
	$.mobile.touchOverflowEnabled = true;
	
	$.config = {
		icon: {
			phone: {
				57: './images/worlddata-icon_114px.png',
				72: './images/worlddata-icon_114px.png',
				114: './images/worlddata-icon_114px.png'
			}
		},
		glossOnIcon: true,
		startupScreen: {
			phone: './images/worlddata-startup_phone.png'
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
		},
		
		infoWindowTemplate: 
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
			'</div>'
	}
	
	$.fusiontable = {
		id: 3441052,
		field: 'geometry',
		types: {
			'SP.POP.TOTL': {
				name: 'Population',
				styleBoundaries: {
					low: 5000000,
					medium: 50000000,
					high: 100000000
				}
			},
			'EN.ATM.CO2E.KT': {
				name: 'CO2 Emission (in kt)',
				styleBoundaries: {
					low: 50000,
					medium: 500000,
					high: 1000000
				}
			},
			'NY.GDP.PCAP.CD': {
				name: 'Pro-Kopf-Einkommen (aktueller US$-Kurs)',
				styleBoundaries: {
					low: 1000,
					medium: 10000,
					high: 50000
				}
			}
		},
		typeField: 'Indicator Code',
		styles: []
	};
	
	// create layer styles
	$.each($.config.colors, function(val, text) {
		$.fusiontable.styles.push({
			id: val.toString(),
			polygonOptions: {
				fillColor: text.fillColor,
				strokeColor: text.strokeColor,
				strokeWeight: 1,
				fillOpacity: 0.3
			}
		});
	});
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