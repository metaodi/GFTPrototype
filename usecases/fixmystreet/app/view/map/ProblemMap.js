Ext.define('FixMyStreet.view.map.ProblemMap', {
	extend: 'FixMyStreet.view.MapNoCenter',
	alias: 'widget.problemmap',
	
	config: {
		id: 'problemMap',
		mapOptions: {
			zoom: 17,
			streetViewControl: false,
			navigationControl: false
		},
		useCurrentLocation: true
	}
});