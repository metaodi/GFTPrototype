Ext.define('FixMyStreet.view.map.ProblemMap', {
	extend: 'FixMyStreet.view.MapNoCenter',
	alias: 'widget.problemmap',
	
	config: {
		id: 'problemMap',
		mapOptions: {
			zoom: 13,
			disableDefaultUI: true,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			}
		},
		useCurrentLocation: true
	}
});