Ext.define('FixMyStreet.view.report.ReportMap', {
	extend: 'FixMyStreet.view.MapNoCenter',
	alias: 'widget.reportmap',
	
	config: {
		id: 'reportMap',
		mapOptions: {
			zoom: 17,
			streetViewControl: false,
			navigationControl: false
		},
		useCurrentLocation: true
	}
});