$(document).ready(function() {
	$.constants = {
		minYear: 1960,
		maxYear: 2010,
		
		lowPopulation: 5000000,
		mediumPopulation: 50000000,
		highPopulation: 100000000
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
				polygonOptions: {
					fillColor: "#ff0000",
					strokeColor: "#ff0000",
					strokeWeight: 1
				}
			},
			{
				polygonOptions: {
					fillColor: "#ff9900",
					strokeColor: "#ff9900",
					strokeWeight: 1
				}
			},
			{
				polygonOptions: {
					fillColor: "#ffff00",
					strokeColor: "#ffff00",
					strokeWeight: 1
				}
			},
			{
				polygonOptions: {
					fillColor: "#ffffcc",
					strokeColor: "#ffffcc",
					strokeWeight: 1
				}
			},
			{
				polygonOptions: {
					fillColor: "#ffffff",
					strokeColor: "#ffffff",
					strokeWeight: 1
				}
			}
		]
	};
});