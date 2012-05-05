Ext.define('FixMyStreet.view.list.ProblemList', {
	extend: 'Ext.dataview.List',
	alias: 'widget.problemlist',
	
	config: {
		id: 'problemList',
		store: 'Problems',
		loadingText: 'Defekte werden geladen...',
		emptyText: 'keine Defekte vorhanden',
		disableSelection: true,
		grouped: true,
		
		itemTpl: new Ext.XTemplate(
			'<div class="problem-item {status}">',
				'<div class="image">',
					'<tpl switch="status">',
						'<tpl case="done">',
							'<img src="./resources/images/problem-types/{type}-grey.png" />',
						'<tpl default>',
							'<img src="./resources/images/problem-types/{type}.png" />',
					'</tpl>',
				'</div>',
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
		),
		
		items: {
			xtype: 'toolbar',
			items: [
				{
					xtype: 'searchfield',
					id: 'problemListSearchField',
					placeHolder: 'Defekt suchen...',
					flex: 1
				}
			]
		},
		
		plugins: [
			'problempullrefresh'
		],
		
		listeners: {
			refresh: function() { Ext.Logger.log('[list] refreshing'); }
		}
	}
});
