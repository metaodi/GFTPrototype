function CountriesController() {
	if(this === global) {return new CountriesController();}
	
	this.map = null;
	this.layer = null;
	this.year = 0;
	this.conditionType = 0;
	this.mouseClickListener = null;
	
	this.getLayer = function() {
		return this.layer;
	}
	this.setLayer = function(layer) {
		this.layer = layer;
	}
	this.getMap = function() {
		return this.map;
	}
	this.setMap = function(map) {
		this.map = map;
	}
	this.getYear = function() {
		return this.year;
	}
	this.setYear = function(year) {
		this.year = year;
	}
	this.getConditionType = function() {
		return this.conditionType;
	}
	this.setConditionType = function(conditionType) {
		this.conditionType = conditionType;
	}
	this.getMouseClickListener = function() {
		return this.mouseClickListener;
	}
	this.setMouseClickListener = function(mouseClickListener) {
		this.mouseClickListener = mouseClickListener;
	}
	
	this.createMap = function(domElementId, position) {
		var map = new google.maps.Map(document.getElementById(domElementId), {
			center: position,
			zoom: 2,
			disableDefaultUI: true, // disable all controls
			zoomControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		this.setMap(map);
	}
	
	this.createLayer = function() {
		this.setLayer(new google.maps.FusionTablesLayer({
			styles: $.fusiontable.styles
		}));
	}
	
	this.updateLayer = function() {
		this.setStyleConditions();
		this.getLayer().setOptions({
			query: {
				select: $.fusiontable.field,
				from: $.fusiontable.id,
				where: $.fusiontable.where
			}
		});
		this.createInfoWindow();
	}
	
	this.setStyleConditions = function() {
		var conditionType = this.getConditionType();
		
		if(conditionType != 0) {
			if($.fusiontable.styleConditions !== undefined) {
				$.fusiontable.styles[1].where = '\'' + this.getYear() + '\' < ' + $.fusiontable.styleConditions[conditionType].high;
				$.fusiontable.styles[2].where = '\'' + this.getYear() + '\' < ' + $.fusiontable.styleConditions[conditionType].medium;
				$.fusiontable.styles[3].where = '\'' + this.getYear() + '\' < ' + $.fusiontable.styleConditions[conditionType].low;
				$.fusiontable.styles[4].where = '\'' + this.getYear() + '\' = \'\'';
			}

			if($.fusiontable.styles !== undefined) {
				$.each($.fusiontable.styles, function(val, text) {
					var tmpText = "";
					if(text.polygonOptions) {
						if(text.id == "veryhigh") {
							tmpText = '>= ' + formatNumber($.fusiontable.styleConditions[conditionType].high);
						} else if(text.id == "high") {
							tmpText = '< ' + formatNumber($.fusiontable.styleConditions[conditionType].high);
						} else if(text.id == "medium") {
							tmpText = '< ' + formatNumber($.fusiontable.styleConditions[conditionType].medium);
						} else if(text.id == "low") {
							tmpText = '< ' + formatNumber($.fusiontable.styleConditions[conditionType].low);
						} else if(text.id == "nodata") {
							tmpText = 'keine Daten vorhanden';
						}
					}
					$('#layerLegend .' + text.id + '-text').html(tmpText);
				});
			}
		}
	}
	
	this.createInfoWindow = function() {
		var currentYear = this.getYear();
		var conditionType = this.getConditionType();
		
		// remove old listener
		if(this.getMouseClickListener()) {
			google.maps.event.removeListener(this.getMouseClickListener());
		}
		
		var listener = google.maps.event.addListener(this.getLayer(), 'click', function(e) {
			// Change the content of the InfoWindow
			var tempInfoWindow = $.infoWindowTemplate;
			var valueCurrentYear = e.row[currentYear].value;
			var valueCurrentYearText = valueCurrentYear;
			if(!valueCurrentYearText) {
				valueCurrentYearText = '-';
			}
			
			tempInfoWindow = tempInfoWindow.replace('###COUNTRY###', e.row['name'].value);
			tempInfoWindow = tempInfoWindow.replace('###YEAR###', currentYear);
			tempInfoWindow = tempInfoWindow.replace('###LAYERTITLE###', $.types[conditionType]);
			tempInfoWindow = tempInfoWindow.replace('###LAYERVALUE###', formatNumber(valueCurrentYearText));
			var differencePreviousYear = '';
			if(currentYear > $.config.minYear && valueCurrentYear) {
				var valuePreviousYear = e.row[currentYear - 1].value
				if(valuePreviousYear) {
					differencePreviousYear = (valueCurrentYear * 100 / valuePreviousYear) - 100;
					differencePreviousYear = round(differencePreviousYear, 2);

					if(differencePreviousYear >= 0) {
						differencePreviousYear = '+' + differencePreviousYear + '%';
					} else {
						differencePreviousYear = differencePreviousYear + '%';
					}
				}
			} else {
				differencePreviousYear = '-';
			}
			
			tempInfoWindow = tempInfoWindow.replace('###DIFFERENCEPREVIOUSYEAR###', differencePreviousYear);
			e.infoWindowHtml = tempInfoWindow;
		});
		
		this.setMouseClickListener(listener);
	}
}
