$('#mapPage').live('pageinit', function(event) {
	var layers = Array();
	var activeLayerId = 0;
	
	addIosHeader();
	setInitialUiValues();
	var map = createMap('map_canvas', new google.maps.LatLng(45, 8));
	
	// year slider change event
	$("#yearSlider").bind("change", function(event, ui) {
		var newYear = event.currentTarget.value;
		
		// only update ui if year changes
		if($("#yearSliderValue").val() != newYear) {
			changeYear(activeLayerId, newYear);
		}
		$("#yearSliderValue").css('left', $("#timeline a.ui-slider-handle").position().left);
		$("#yearSliderValueArrow").css('left', $("#timeline a.ui-slider-handle").position().left);
	});
	
	$("#layerSelection").change(function() {
		var tableId = $('#layerSelection').val();
		
		if(activeLayerId != 0 && layers[activeLayerId]) {
			layers[activeLayerId].setMap(null);
			activeLayerId = 0;
			$('#layerLegend').css('display', 'none');
		}
		if(tableId != 0) {
			if(!layers[tableId]) {
				layers[tableId] = createLayer(tableId, $("#yearSlider").val());
			} else {
				updateLayer(layers[tableId], tableId, $("#yearSlider").val());
			}
			$('#layerLegend').css('display', 'block');
			activeLayerId = tableId;
			layers[tableId].setMap(map);
			
		}
		// refresh map to avoid rendering bugs
		google.maps.event.trigger(map, 'resize');
	});
	
	function addIosHeader() {
		// add ios styles to head
		var iconRel = 'apple-touch-icon';
		if($.config.glossOnIcon !== undefined && !$.config.glossOnIcon) {
			iconRel = 'apple-touch-icon-precomposed';
		}
		if($.config.icon !== undefined) {
			var iconPhoneType = typeof($.config.icon.phone);
			if(iconPhoneType == 'object') {
				$('head').append('<link rel="' + iconRel + '" href="' + $.config.icon.phone[57] + '" />');
				$('head').append('<link rel="' + iconRel + '" sizes="72x72" href="' + $.config.icon.phone[72] + '" />');
				$('head').append('<link rel="' + iconRel + '" sizes="114x114" href="' + $.config.icon.phone[114] + '" />');
			} else if(iconPhoneType == 'string') {
				$('head').append('<link rel="' + iconRel + '" href="' + $.config.icon.phone + '" />');
			}
		}

		if($.config.startupScreen !== undefined && $.config.startupScreen.phone) {
			$('head').append('<link rel="apple-touch-startup-image" href="' + $.config.startupScreen.phone + '">');
		}
		var statusBarStyle = 'black';
		if($.config.statusBarStyle !== undefined) {
			statusBarStyle = $.config.statusBarStyle;
		}
		$('head').append('<meta name="apple-mobile-web-app-status-bar-style" content="' + statusBarStyle + '" />');
	}
	
	function setInitialUiValues() {
		// set intial values
		$("#yearSlider").attr("value", $.config.minYear);
		$("#yearSlider").attr("min", $.config.minYear);
		$("#yearSlider").attr("max", $.config.maxYear);
		$("#timeline a.ui-slider-handle").attr("title", $.config.minYear);
		$("#yearSliderValue").val($("#yearSlider").val());
		// don't us disable() method to prevent jquery styling
		$("#yearSliderValue").attr("disabled", "disabled");
		
		// add layers to selectfield
		$.each($.fusiontables, function(val, text) {
			$('#layerSelection').append(
				$('<option></option>').val(val).html(text.name)
			);
		});

		// fill legend colors
		$.each($.layerStyles, function(val, text) {
			if(text.polygonOptions) {
				$('#layerLegend .' + text.id + '-color').css('background-color', hex2rgb(text.polygonOptions.fillColor, text.polygonOptions.fillOpacity));
				$('#layerLegend .' + text.id + '-color').css('border-color', text.polygonOptions.strokeColor);
			}
		});
	}
	
	function createMap(domElementId, position) {
		return new google.maps.Map(document.getElementById(domElementId), {
			center: position,
			zoom: 2,
			disableDefaultUI: true, // disable all controls
			zoomControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
	}

	function changeYear(tableId, newYear) {
		$("#yearSliderValue").val(newYear);
		if(layers[tableId]) {
			updateLayer(layers[tableId], tableId, newYear);
		}
	}
	
	function setStyleConditions(tableId, year) {
		if($.fusiontables[tableId].styleConditions !== undefined) {
			$.fusiontables[tableId].styles[1].where = '\'' + year + '\' < ' + $.fusiontables[tableId].styleConditions.high;
			$.fusiontables[tableId].styles[2].where = '\'' + year + '\' < ' + $.fusiontables[tableId].styleConditions.medium;
			$.fusiontables[tableId].styles[3].where = '\'' + year + '\' < ' + $.fusiontables[tableId].styleConditions.low;
			$.fusiontables[tableId].styles[4].where = '\'' + year + '\' = \'\'';
		}
		
		if($.fusiontables[tableId].styles !== undefined) {
			$.each($.fusiontables[tableId].styles, function(val, text) {
				var tmpText = "";
				if(text.polygonOptions) {
					if(text.id == "veryhigh") {
						tmpText = '>= ' + formatNumber($.fusiontables[tableId].styleConditions.high);
					} else if(text.id == "high") {
						tmpText = '< ' + formatNumber($.fusiontables[tableId].styleConditions.high);
					} else if(text.id == "medium") {
						tmpText = '< ' + formatNumber($.fusiontables[tableId].styleConditions.medium);
					} else if(text.id == "low") {
						tmpText = '< ' + formatNumber($.fusiontables[tableId].styleConditions.low);
					} else if(text.id == "nodata") {
						tmpText = 'keine Daten vorhanden';
					}
				}
				$('#layerLegend .' + text.id + '-text').html(tmpText);
			});
		}
	}
	
	function createLayer(tableId, year) {
		console.log("creating layer for table " + tableId);
		setStyleConditions(tableId, year);
		
		var layer = new google.maps.FusionTablesLayer({
			query: {
				select: $.fusiontables[tableId].field,
				from: tableId
			},
			styles: $.fusiontables[tableId].styles
		});
		
		createInfoWindow(layer);
		layers[tableId] = layer;
		
		return layer;
	}

	function updateLayer(layer, tableId, year) {
		setStyleConditions(tableId, year);
		layer.setOptions({
			query: {
				select: $.fusiontables[tableId].field,
				from: tableId
			}
		});
		
		createInfoWindow(layer);
	}

	function createInfoWindow(layer) {
		google.maps.event.clearInstanceListeners(map);
		google.maps.event.addListener(layer, 'click', function(e) {
			var selectedTableId = $('#layerSelection').val();
			
			// Change the content of the InfoWindow
			var tempInfoWindow = $.infoWindowTemplate;
			var currentYear = $("#yearSlider").val();
			var valueCurrentYear = e.row[currentYear].value;
			var valueCurrentYearText = valueCurrentYear;
			if(!valueCurrentYearText) {
				valueCurrentYearText = '-';
			}
			
			tempInfoWindow = tempInfoWindow.replace('###COUNTRY###', e.row['name'].value);
			tempInfoWindow = tempInfoWindow.replace('###YEAR###', currentYear);
			tempInfoWindow = tempInfoWindow.replace('###LAYERTITLE###', $.fusiontables[selectedTableId].name);
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
	}
});

$('#mapPage').live('pageshow', function() {
});
