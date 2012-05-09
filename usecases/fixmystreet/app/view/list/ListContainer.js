Ext.define('FixMyStreet.view.list.ListContainer', {
	extend: 'Ext.Container',
	alias: 'widget.listcontainer',
	
	config: {
		title: 'Liste',
		url: 'list',
		id: 'listContainer',
		iconCls: 'bookmarks',
		layout: 'vbox',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: 'Meine Defekte'
			},
			{
				xtype: 'problemlist',
				flex: 1
			}
		]
	}
});