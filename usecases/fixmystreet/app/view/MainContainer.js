Ext.define('FixMyStreet.view.MainContainer', {
	extend: 'Ext.Container',
	
	config: {
		id: 'maincontainer',
		layout: 'card',
		fullscreen: true,
		
		items: [
			{
				xtype: 'tabpanel',
				id: 'mainTabPanel',
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
						xtype: 'listcontainer'
					},
					{
						xtype: 'mapcontainer'
					}
				]
			}
		]
	}
});
