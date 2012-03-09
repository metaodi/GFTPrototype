module("FusionTablesLayer");
test("PaintSwitzerland", function() {
	var switzerland = new google.maps.LatLng(46.85, 8.7);

	var layer = new google.maps.FusionTablesLayer({
		query: {
			select: 'Location',
			from: '2741123'
		}
	});
	
	ok(layer instanceof google.maps.FusionTablesLayer,'Object should be of google.maps.FusionTablesLayer');
});


function initialize() {
	var switzerland = new google.maps.LatLng(46.85, 8.7);

	var map = new google.maps.Map(document.getElementById('map_canvas'), {
		center: switzerland,
		zoom: 9,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var layer = new google.maps.FusionTablesLayer({
		query: {
			select: 'Location',
			from: '2741123'
		}
	});
	layer.setMap(map);
}