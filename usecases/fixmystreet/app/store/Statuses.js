Ext.define('FixMyStreet.store.Statuses', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.Status',
		autoLoad: true,
		
		data: [
			{ key: 'new', value: 'Neu', sorting: 1 },
			{ key: 'working', value: 'In Arbeit', sorting: 2 },
			{ key: 'done', value: 'Erledigt', sorting: 3 }
		]
	}
});
