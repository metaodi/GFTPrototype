Ext.define('FixMyStreet.view.map.SettingsPopupPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.settingspopuppanel',
	
	config: {
		id: 'settingsPopupPanel',
		top: 0,
		left: 0,
		modal: true,
		hideOnMaskTap: true,
		
		items: [
			{
				xtype: 'titlebar',
				title: 'Einstellungen',
				items: [
					{
						html: 'X',
						iconMask: 'true',
						align: 'right',
						id: 'settingsPopupCloseButton'
					}
				]
			},
			{
				xtype: 'layersegmentedbutton',
				allowDepress: false
			}
		]
	}
});