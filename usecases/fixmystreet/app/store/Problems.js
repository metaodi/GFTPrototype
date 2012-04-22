Ext.define('FixMyStreet.store.Problems', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.Problem',
		autoLoad: true,
		
		// group problems by status and sort groups by sorting field of status
		grouper: {
			groupFn: function(record) {
				return record.getData().status.value;
			},
			sortProperty: 'sorting'
		},
		// sort problems by timestamp (descending)
		sorters: {
			property: 'timestamp',
			direction: 'DESC'
		},
		
		// @TODO remove dummy data
		data: [
			{
				id: 1,
				timestamp: 1334932127,
				address: 'Schulstrasse 2, Rapperswil',
				latitude: '47.2',
				longitude: '8.81',
				status: {
					key: 'new',
					value: 'Neu'
				},
				type: {
					text: 'Littering',
					value: 'trash'
				}
			},
			{
				id: 2,
				timestamp: 1334930000,
				address: 'Bärenweg 5, Bern',
				latitude: '47.8',
				longitude: '8.11',
				status: {
					key: 'working',
					value: 'In Arbeit'
				},
				type: {
					text: 'Eisglätte',
					value: 'ice'
				}
			},
			{
				id: 3,
				timestamp: 1234930000,
				address: 'Rosenstrasse 5, Russikon',
				latitude: '47.3',
				longitude: '7.11',
				status: {
					key: 'done',
					value: 'Erledigt'
				},
				type: {
					text: 'Strassenlampe',
					value: 'light'
				}
			},
			{
				id: 4,
				timestamp: 1239945000,
				address: 'Limmatstrasse 2, Zürich',
				latitude: '44.3',
				longitude: '7.11',
				status: {
					key: 'done',
					value: 'Erledigt'
				},
				type: {
					text: 'Schlagloch',
					value: 'hump'
				}
			}
		]
	}
});
