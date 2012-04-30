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
				title: 'Meine Defekte',
				items: [
					{
						iconCls: 'settings',
						iconMask: 'true',
						align: 'right',
						id: 'filterPopupButton'
					}
				]
			},
			{
				xtype: 'toolbar',
				items: [
					{
						xtype: 'searchfield',
						id: 'problemListSearchField',
						placeHolder: 'Adresse Suchen...',
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