Ext.define('FixMyStreet.view.list.ProblemList', {
	extend: 'Ext.dataview.List',
	alias: 'widget.problemlist',
	
	config: {
		id: 'problemList',
		loadingText: 'Probleme werden geladen...',
		emptyText: 'keine gemeldeten Probleme vorhanden',
		disableSelection: true,
		grouped: true,
		
		itemTpl: new Ext.XTemplate(
			'<div class="problem-item">',
				'<tpl for="type">',
					'<div class="image"><img src="./resources/images/problem-types/{value}.png" /></div>',
				'</tpl>',
				'<div class="info">',
					'<p class="date">{[this.getDate(values.timestamp)]}</p>',
					'<p class="address">{address}</p>',
				'</div>',
			'</div>',
			{
				// XTemplate configuration:
				disableFormats: true,
				// member functions:
				getDate: function(timestamp){
					var ts = new Timestamp(timestamp);
					return ts.getDate();
				}
			}
		)/*,
		
		plugins: [
			'fixlistoptions'
		]*/
	}
});