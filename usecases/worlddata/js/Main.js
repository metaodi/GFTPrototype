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

$('#mapPage').live('pageinit', function(event) {
	var controller = new CountriesController();
	
	addIosHeader();
	setInitialUiValues();
	controller.createMap('map_canvas', new google.maps.LatLng($.config.map.center.lat, $.config.map.center.lng), $.config.map.zoom);
	
	// year slider change event
	$("#yearSlider").bind("change", function(event, ui) {
		// only update ui if year changes
		if(event.currentTarget.value != controller.getYear()) {
			controller.setYear(event.currentTarget.value);
			$("#yearSliderValue").val(controller.getYear());
			if(controller.getLayer() && controller.getLayer().getMap()) {
				controller.updateLayer();
			}
		}
		$("#yearSliderValue").css('left', $("#timeline a.ui-slider-handle").position().left);
		$("#yearSliderValueArrow").css('left', $("#timeline a.ui-slider-handle").position().left);
	});
	
	$("#typeSelection").change(function() {
		controller.setConditionType($('#typeSelection').val());
		if(controller.getConditionType() == 0 && controller.getLayer()) {
			controller.getLayer().setMap(null);
			$('#layerLegend').css('display', 'none');
			$('#data-copyright').css('display', 'none');
		} else {
			$.fusiontable.where = '\'' + $.fusiontable.typeField + '\' = \'' + controller.getConditionType() + '\'';
			if(!controller.getLayer()) {
				controller.createLayer();
			}
			controller.updateLayer();
			$('#layerLegend').css('display', 'block');
			$('#data-copyright').css('display', 'block');
		}
		
		// refresh map to avoid rendering bugs
		google.maps.event.trigger(controller.getMap(), 'resize');
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
		controller.setYear($.config.minYear);
		$("#yearSlider").attr("value", controller.getYear());
		$("#yearSlider").attr("min", controller.getYear());
		$("#yearSlider").attr("max", $.config.maxYear);
		$("#timeline a.ui-slider-handle").attr("title", controller.getYear());
		$("#yearSliderValue").val($("#yearSlider").val());
		// don't us disable() method to prevent jquery styling
		$("#yearSliderValue").attr("disabled", "disabled");
		
		// add layer types to selectfield
		$.each($.fusiontable.types, function(val, text) {
			$('#typeSelection').append(
				$('<option></option>').val(val).html(text.name)
			);
		});
		
		// add legend entries
		$.each($.fusiontable.styles, function(val, text) {
			if(text.polygonOptions) {
				var backgroundColor = hex2rgb(text.polygonOptions.fillColor, text.polygonOptions.fillOpacity);
				$('#layerLegend').prepend(
					'<dt class="' + text.id + '-color" style="background-color: ' + backgroundColor + '; border-color: ' + text.polygonOptions.strokeColor + ';"></dt>',
					'<dd class="' + text.id + '-text"></dd>'
				);
			}
		});
	}
});