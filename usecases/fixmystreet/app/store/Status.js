Ext.define('FixMyStreet.store.Status', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.Status',
		autoLoad: true,
		
		data: [
			{ key: 'new', value: 'Neu', sorting: 1 },
			{ key: 'inprogress', value: 'In Arbeit', sorting: 2 },
			{ key: 'done', value: 'Erledigt', sorting: 3 }
		]
	}
});
