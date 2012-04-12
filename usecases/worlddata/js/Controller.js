function WorldDataController() {
	if(this === global) { return new WorldDataController(); }
	
	this.map = null;
	this.layer = null;
	this.year = 0;
	this.conditionType = 0;
	this.mouseClickListener = null;
	
	this.createMap = function(domElementId, centerLatLng, initialZoom) {
		var map = new google.maps.Map(document.getElementById(domElementId), {
			center: centerLatLng,
			zoom: initialZoom,
			disableDefaultUI: true, // disable all controls
			zoomControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		this.setMap(map);
	};
	
	this.createLayer = function() {
		// create empty fusion table layer with styles-attribute (can't be set with setOptions()-method)
		this.setLayer(new google.maps.FusionTablesLayer({
			styles: $.fusiontable.styles
		}));
	};
	
	this.updateLayer = function() {
		this.getLayer().setMap(null);
		this.setStyleConditions();
		this.getLayer().setOptions({
			query: {
				select: $.fusiontable.field,
				from: $.fusiontable.id,
				where: $.fusiontable.where
			}
		});
		this.createInfoWindow();
		this.getLayer().setMap(this.getMap());
	};
	
	this.setStyleConditions = function() {
		var conditionType = this.getConditionType();
		
		if(conditionType != 0) {
			if($.fusiontable.types !== undefined) {
				$.fusiontable.styles[1].where = '\'' + this.getYear() + '\' < ' + $.fusiontable.types[conditionType].styleBoundaries.high;
				$.fusiontable.styles[2].where = '\'' + this.getYear() + '\' < ' + $.fusiontable.types[conditionType].styleBoundaries.medium;
				$.fusiontable.styles[3].where = '\'' + this.getYear() + '\' < ' + $.fusiontable.types[conditionType].styleBoundaries.low;
				$.fusiontable.styles[4].where = '\'' + this.getYear() + '\' = \'\'';
			}
			
			if($.fusiontable.styles !== undefined) {
				$.each($.fusiontable.styles, function(val, text) {
					var tmpText = "";
					if(text.polygonOptions) {
						if(text.id == "veryhigh") {
							tmpText = '&ge; ' + formatNumber($.fusiontable.types[conditionType].styleBoundaries.high);
						} else if(text.id == "high") {
							tmpText = '&lt; ' + formatNumber($.fusiontable.types[conditionType].styleBoundaries.high);
						} else if(text.id == "medium") {
							tmpText = '&lt; ' + formatNumber($.fusiontable.types[conditionType].styleBoundaries.medium);
						} else if(text.id == "low") {
							tmpText = '&lt; ' + formatNumber($.fusiontable.types[conditionType].styleBoundaries.low);
						} else if(text.id == "nodata") {
							tmpText = 'keine Daten vorhanden';
						}
					}
					$('#layerLegend .' + text.id + '-text').html(tmpText);
				});
			}
		}
	};
	
	this.createInfoWindow = function() {
		var currentYear = this.getYear();
		var conditionType = this.getConditionType();
		
		// remove old listener
		if(this.getMouseClickListener()) {
			google.maps.event.removeListener(this.getMouseClickListener());
		}
		
		var listener = google.maps.event.addListener(this.getLayer(), 'click', function(e) {
			// Change the content of the InfoWindow
			var tempInfoWindow = $.config.infoWindowTemplate;
			var valueCurrentYear = e.row[currentYear].value;
			
			var imgSrc = getImageSource(e.row['description'].value);
			if(imgSrc) {
				tempInfoWindow = tempInfoWindow.replace('###IMAGETAG###', '<img class="flag" src="' + imgSrc + '" alt="' + e.row['name'].value + '" />');
			} else {
				tempInfoWindow = tempInfoWindow.replace('###IMAGETAG###', '');
			}
			
			tempInfoWindow = tempInfoWindow.replace('###COUNTRY###', e.row['name'].value);
			tempInfoWindow = tempInfoWindow.replace('###YEAR###', currentYear);
			tempInfoWindow = tempInfoWindow.replace('###LAYERTITLE###', $.fusiontable.types[conditionType].name);
			
			var valueCurrentYearText = '-';
			if(valueCurrentYear) {
				valueCurrentYearText = formatNumber(round(valueCurrentYear, 2));
			}
			tempInfoWindow = tempInfoWindow.replace('###LAYERVALUE###', valueCurrentYearText);
			
			var differencePreviousYear = '-';
			if(currentYear > $.config.minYear && valueCurrentYear) {
				var valuePreviousYear =  e.row[currentYear - 1].value;
				if(valuePreviousYear) {
					differencePreviousYear = getDifferencePercentage(valueCurrentYear, valuePreviousYear);
				}
			}
			tempInfoWindow = tempInfoWindow.replace('###DIFFERENCEPREVIOUSYEAR###', differencePreviousYear);
			
			e.infoWindowHtml = tempInfoWindow;
		});
		
		this.setMouseClickListener(listener);
	};
	
	function getImageSource(description) {
		// extracting image source from description
		var imgSrcReg = /src=\"(.+\.jpg)\"/; 
		var imgSrcMatchesArr = description.match(imgSrcReg);
		if(imgSrcMatchesArr && imgSrcMatchesArr.length == 2) {
			return imgSrcMatchesArr[1];
		}
		return false;
	}
	
	function getDifferencePercentage(currentValue, otherValue) {
		if (otherValue === 0) {
			throw new Error("Value to compare may not be zero.");
		}
		
		var differenceInPercent = (currentValue * 100 / otherValue) - 100;
		differenceInPercent = round(differenceInPercent, 2);

		if(differenceInPercent > 0) {
			differenceInPercent = '+' + differenceInPercent;
		}
		return differenceInPercent + '%';
	}
	
	// only used by unit test, because the private methods are not visible otherwise
	this.__getImageSource = getImageSource;
	this.__getDifferencePercentage = getDifferencePercentage;
	
	this.getLayer = function() {
		return this.layer;
	};
	this.setLayer = function(layer) {
		this.layer = layer;
	};
	this.getMap = function() {
		return this.map;
	};
	this.setMap = function(map) {
		this.map = map;
	};
	this.getYear = function() {
		return this.year;
	};
	this.setYear = function(year) {
		this.year = year;
	};
	this.getConditionType = function() {
		return this.conditionType;
	};
	this.setConditionType = function(conditionType) {
		this.conditionType = conditionType;
	};
	this.getMouseClickListener = function() {
		return this.mouseClickListener;
	};
	this.setMouseClickListener = function(mouseClickListener) {
		this.mouseClickListener = mouseClickListener;
	};
}
