Ext.define('FixMyStreet.store.Types', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.Type',
		autoLoad: true,
		
		data: [
			{ text: 'Typ wählen...', value: 'undefined' },
			{ text: 'Schlagloch', value: 'hump' },
			{ text: 'Eisglätte', value: 'ice' },
			{ text: 'Strassenlampe', value: 'light' },
			{ text: 'Littering', value: 'trash' }
		]
	}
});
