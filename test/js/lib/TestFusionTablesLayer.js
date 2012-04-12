module("FusionTablesLayer");
test("Construct", function() {
	var switzerland = new google.maps.LatLng(46.85, 8.7);
	var layer = new google.maps.FusionTablesLayer();
	
	ok(layer instanceof google.maps.FusionTablesLayer,'Object should be of google.maps.FusionTablesLayer');
	ok(switzerland instanceof google.maps.LatLng,'Object should be ofgoogle.maps.LatLng');
});
test("PaintMap", function() {
	var switzerland = new google.maps.LatLng(46.85, 8.7);
	var layer = new google.maps.FusionTablesLayer({
		query: {
			select: 'Location',
			from: '2741123'
		}
	});
	var canvas = document.createElement("div");
	var map = new google.maps.Map(canvas, {
		center: switzerland,
		zoom: 9,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	layer.setMap(map);
	equal(canvas.getElementsByTagName("div").length,  1, "There should be a map on the canvas.")
});