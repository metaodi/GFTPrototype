Ext.define('FixMyStreet.store.ProblemTypes', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.ProblemType',
		autoLoad: true,
		
		data: [
			{ text: 'Defekt wählen...', value: 'undefined' },
			{ text: 'Schlagloch', value: 'hump' },
			{ text: 'Eisglätte', value: 'ice' },
			{ text: 'Strassenlampe', value: 'light' },
			{ text: 'Littering', value: 'trash' }
		]
	}
});
