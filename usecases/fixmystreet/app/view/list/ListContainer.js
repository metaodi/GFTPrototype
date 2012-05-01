Ext.define('FixMyStreet.view.list.ListContainer', {
	extend: 'Ext.Container',
	alias: 'widget.listcontainer',
	
	config: {
		title: 'Liste',
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
			{
				xtype: 'problemlist',
				flex: 1
			}
		]
	}
});