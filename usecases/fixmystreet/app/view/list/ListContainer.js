Ext.define('FixMyStreet.view.list.ListContainer', {
	extend: 'Ext.Container',
	alias: 'widget.listcontainer',
	
	config: {
		title: 'Liste',
		id: 'listContainer',
		iconCls: 'list',
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