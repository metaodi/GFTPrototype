Ext.define('FixMyStreet.view.report.ReportMap', {
	extend: 'FixMyStreet.view.MapNoCenter',
	alias: 'widget.reportmap',
	
	config: {
		id: 'reportMap',
		mapOptions: {
			zoom: 17,
			disableDefaultUI: true,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			}
		},
		useCurrentLocation: true
	}
});