$(document).ready(function() {
	
	$("#yearSlider").slider({
		min: $.constants.minYear,
		max: $.constants.maxYear,
		slide: function(event, ui) {
			$("#yearSliderValue").html(ui.value);
			changeYear(activeLayerId, ui.value);
			var position = ((ui.value - $.constants.minYear) * 100 / ($.constants.maxYear - $.constants.minYear)); 
			//position = $("#yearSlider a").position().left + 20;
			$("#yearSliderValue").css('left', position + '%');
			$("#yearSliderValueArrow").css('left', position + '%');
		}
	});
	$("#yearSliderValue").html($("#yearSlider").slider("value"));
	
	$.fusiontables = {
		3378569: {
			name: 'Einwohner',
			field: 'geometry',
			styleConditions: {
				low: 5000000,
				medium: 50000000,
				high: 100000000
			},
			styles: $.layerStyles.polygons
		}
	};
	
	// add layers to selectfield
	$.each($.fusiontables, function(val, text) {
		$('#layerSelection').append(
			$('<option></option>').val(val).html(text.name)
		);
	});
	
	// fill legend colors
	$.each($.layerStyles.polygons, function(val, text) {
		console.log(text.id);
		$('#layerLegend .' + text.id + '-color').css('background-color', text.polygonOptions.fillColor);
		$('#layerLegend .' + text.id + '-color').css('border-color', text.polygonOptions.strokeColor);
	});
	
	var layers = Array();
	var activeLayerId = 0;
	var position = new google.maps.LatLng(45, 8);
	var map = new google.maps.Map(document.getElementById('map_canvas'), {
		center: position,
		zoom: 2,
		mapTypeId: google.maps.MapTypeId.ROADMAP
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
				layers[tableId] = createLayer(tableId, $("#yearSlider").slider("value"));
			} else {
				updateLayer(layers[tableId], tableId, $("#yearSlider").slider("value"));
			}
			$('#layerLegend').css('display', 'block');
			activeLayerId = tableId;
			layers[tableId].setMap(map);
		}
	});
	
	function changeYear(tableId, newYear) {
		if(layers[tableId]) {
			updateLayer(layers[tableId], tableId, newYear);
		}
	}
	
	function setStyleConditions(tableId, year) {
		$.fusiontables[tableId].styles[1].where = '\'' + year + '\' < ' + $.fusiontables[tableId].styleConditions.high;
		$.fusiontables[tableId].styles[2].where = '\'' + year + '\' < ' + $.fusiontables[tableId].styleConditions.medium;
		$.fusiontables[tableId].styles[3].where = '\'' + year + '\' < ' + $.fusiontables[tableId].styleConditions.low;
		$.fusiontables[tableId].styles[4].where = '\'' + year + '\' = \'\'';
		
		$.each($.layerStyles.polygons, function(val, text) {
			console.log(text.id);
			var tmpText = "";
			if(text.id == "veryhigh") {
				tmpText = '>= ' + $.fusiontables[tableId].styleConditions.high;
			} else if(text.id == "high") {
				tmpText = '< ' + $.fusiontables[tableId].styleConditions.high;
			} else if(text.id == "medium") {
				tmpText = '< ' + $.fusiontables[tableId].styleConditions.medium;
			} else if(text.id == "low") {
				tmpText = '< ' + $.fusiontables[tableId].styleConditions.low;
			} else if(text.id == "nodata") {
				tmpText = 'keine Daten vorhanden';
			}
			$('#layerLegend .' + text.id + '-text').html(tmpText);
		});
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

		google.maps.event.clearInstanceListeners(map);
		createInfoWindow(layer);
	}

	function createInfoWindow(layer) {
		google.maps.event.addListener(layer, 'click', function(e) {
			// Change the content of the InfoWindow
			var tempInfoWindow = $.infoWindowTemplate;
			tempInfoWindow = tempInfoWindow.replace('###COUNTRY###', e.row['name'].value);
			tempInfoWindow = tempInfoWindow.replace('###POPULATION###', e.row[$("#yearSlider").slider("value")].value);
			e.infoWindowHtml = tempInfoWindow;
		});
	}
});