Ext.define('FixMyStreet.view.map.FilterPopupPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.filterpopuppanel',
	
	config: {
		id: 'filterPopupPanel',
		top: 0,
		left: 0,
		modal: true,
		hideOnMaskTap: true,
		
		items: [
			{
				xtype: 'titlebar',
				title: 'Filter',
				items: [
					{
						html: 'X',
						iconMask: 'true',
						align: 'right',
						id: 'filterPopupCloseButton'
					}
				]
			}
		]
	}
});