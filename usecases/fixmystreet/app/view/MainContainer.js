Ext.define('FixMyStreet.view.MainContainer', {
	extend: 'Ext.Container',
	
	config: {
		id: 'maincontainer',
		layout: 'card',
		fullscreen: true,
		
		items: [
			{
				xtype: 'titlebar',
				id: 'titlebar',
				docked: 'top',
				title: 'FixMyStreet'
			},
			{
				xtype: 'tabpanel',
				tabBar: {
					docked: 'bottom',
					layout: {
						pack: 'left'
					}
				},
				items: [
					{
						xtype: 'reportcontainer'
					},
					{
						xtype: 'panel',
						scrollable: true,
						title: 'Karte',
						iconCls: 'maps',
						items: []
					}
				]
			}
		]
	}
});
