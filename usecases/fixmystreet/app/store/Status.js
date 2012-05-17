Ext.define('FixMyStreet.store.Status', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.Status',
		
		data: [
			{ key: 'new', value: 'Neu' },
			{ key: 'inprogress', value: 'In Arbeit' },
			{ key: 'done', value: 'Erledigt' }
		]
	}
});
