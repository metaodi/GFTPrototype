// -------------------------------------
// CONFIGURATION STARTS HERE
// -------------------------------------
// fusion table configuration
$.fusiontable = {
	id: '1Ex_gdGfRST85LTD9JxCwhohXFtRKo0_ap9G6cEI',
	field: 'geometry',
	typeField: 'Indicator Code',
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
			name: 'Pro-Kopf-Einkommen (in US$)',
			styleBoundaries: {
				low: 1000,
				medium: 10000,
				high: 50000
			}
		}
	}
};

// application configuration
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
		'   ###IMAGETAG###' +
		'	<dl class="info">' +
		'		<dt>Jahr:</dt>' +
		'		<dd>###YEAR###</dd>' +
		'		<dt>###LAYERTITLE###:</dt>' +
		'		<dd>###LAYERVALUE###</dd>' +
		'		<dt>Differenz zum Vorjahr:</dt>' +
		'		<dd>###DIFFERENCEPREVIOUSYEAR###</dd>' +
		'	</dl>' +
		'</div>',

	map: {
		center: {
			lat: 30,
			lng: 8
		},
		zoom: 2
	}
}
// -------------------------------------
// CONFIGURATION ENDS HERE
// -------------------------------------

var global = this;

// create layer styles
$.fusiontable.styles = [];
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
