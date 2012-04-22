Ext.define('FixMyStreet.store.ProblemTypes', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.ProblemType',
		autoLoad: true,
		
		data: [
			{ text: 'Defekttyp wählen...', value: 'undefined' },
			{ text: 'Schlagloch', value: 'bump' },
			{ text: 'Eisglätte', value: 'ice' },
			{ text: 'Strassenlampe', value: 'light' },
			{ text: 'Littering', value: 'littering' }
		]
	}
});
