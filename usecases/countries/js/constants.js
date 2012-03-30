$(document).ready(function() {
	$.constants = {
		minYear: 1960,
		maxYear: 2010
	}
	
	$.infoWindowTemplate = 
		'<div class="googft-info-window" style="font-family:sans-serif">' +
		'	<dl>' +
		'		<dt>Country:</dt>' +
		'		<dd>###COUNTRY###</dd>' +
		'		<dt>Population:</dt>' +
		'		<dd>###POPULATION###</dd>' +
		'	</dl>' +
		'</div>';
	
	$.layerStyles = {
		polygons: [
			{
				id: 'veryhigh',
				polygonOptions: {
					fillColor: "#ff0000",
					strokeColor: "#ff0000",
					strokeWeight: 1
				}
			},
			{
				id: 'high',
				polygonOptions: {
					fillColor: "#ff9900",
					strokeColor: "#ff9900",
					strokeWeight: 1
				}
			},
			{
				id: 'medium',
				polygonOptions: {
					fillColor: "#ffff00",
					strokeColor: "#ffff00",
					strokeWeight: 1
				}
			},
			{
				id: 'low',
				polygonOptions: {
					fillColor: "#ffffcc",
					strokeColor: "#ffffcc",
					strokeWeight: 1
				}
			},
			{
				id: 'nodata',
				polygonOptions: {
					fillColor: "#ffffff",
					strokeColor: "#ebebeb",
					strokeWeight: 1
				}
			}
		]
	};
});