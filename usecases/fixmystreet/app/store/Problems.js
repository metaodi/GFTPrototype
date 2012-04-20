Ext.define('FixMyStreet.store.Problems', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.Problem',
		autoLoad: true,
		
		grouper: {
			groupFn: function(record) {
				return record.get('status');
			},
			sortProperty: 'timestamp'
		},
		
		data: [
			{
				id: 1,
				timestamp: 1334932127,
				address: 'Schulstrasse 2, Rapperswil',
				latitude: '47.2',
				longitude: '8.81',
				status: 'In Arbeit',
				type: 'ice'
			},
			{
				id: 2,
				timestamp: 1334930000,
				address: 'Bärenweg 5, Bern',
				latitude: '47.8',
				longitude: '8.11',
				status: 'In Arbeit',
				type: 'ice'
			}
		]
	}
});
