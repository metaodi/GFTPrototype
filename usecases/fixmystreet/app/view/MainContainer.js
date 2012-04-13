Ext.define('FixMyStreet.view.MainContainer', {
	extend: 'Ext.Container',
	
	config: {
		layout: {
			type: 'card'
		},
		fullscreen: true,
		
		items: [
				{
					xtype: 'titlebar',
					docked: 'top',
					title: 'FixMyStreet'
				},
				{
					xtype: 'tabpanel',
					tabBar: {
						docked: 'bottom'
					},
					items: [
					{
						xtype: 'panel',
						title: 'Melden',
						iconCls: 'locate',
						items: [
							{
								xtype: 'reportcontainer'
							}
						]
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
