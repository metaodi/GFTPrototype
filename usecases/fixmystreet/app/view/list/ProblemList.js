Ext.define('FixMyStreet.view.list.ProblemList', {
	extend: 'Ext.dataview.List',
	alias: 'widget.problemlist',
	
	config: {
		id: 'problemList',
		loadingText: 'Probleme werden geladen...',
		emptyText: 'keine gemeldeten Probleme vorhanden',
		grouped: true,
		itemTpl: new Ext.XTemplate(
			'<p>Adresse: {address}</p>',
			'<p>Datum: {[this.getDate(values.timestamp)]}</p>',
			'<tpl for="type">',
				'<p>Problem: {text}</p>',
			'</tpl>',
			'<tpl for="status">',
				'<p>Status: {value}</p>',
			'</tpl>',
			{
				// XTemplate configuration:
				disableFormats: true,
				// member functions:
				getDate: function(timestamp){
					var ts = new Timestamp(timestamp);
					return ts.getDate();
				}
			}
		)
	}
});