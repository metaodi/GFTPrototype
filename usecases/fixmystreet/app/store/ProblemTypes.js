Ext.define('FixMyStreet.store.ProblemTypes', {
    extend: 'Ext.data.Store',
	config: {
		model: 'FixMyStreet.model.ProblemType',
		data: [
			{ text: 'Defekttyp waehlen...', value: 'undefined' },
			{ text: 'Strassenlampe', value: 'light' },
			{ text: 'Schlagloch', value: 'bump' },
			{ text: 'Littering', value: 'littering' },
			{ text: 'Eisglaette', value: 'ice' }
		]
	}
});
