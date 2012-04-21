Ext.define('FixMyStreet.store.ProblemTypes', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.ProblemType',
		autoLoad: true,
		
		data: [
			{ text: 'Defekttyp wählen...', value: 'undefined' },
			{ text: 'Strassenlampe', value: 'light' },
			{ text: 'Schlagloch', value: 'bump' },
			{ text: 'Littering', value: 'littering' },
			{ text: 'Eisglätte', value: 'ice' }
		]
	}
});
