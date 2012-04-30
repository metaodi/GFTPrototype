Ext.define('FixMyStreet.view.report.ReportContainer', {
	extend: 'Ext.Container',
	alias: 'widget.reportcontainer',

	config: {
		title: 'Melden',
		id: 'reportContainer',
		iconCls: 'compose',
		layout: 'vbox',
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: 'Defekt melden',
				
				items: [
					{
						iconCls: 'locate',
						iconMask: 'true',
						align: 'right',
						id: 'reportCurrentLocationButton'
					}
				]
			},
			{
				xtype: 'toolbar',
				cls: 'typeSelectToolbar',
				
				items: [
					{
						xtype: 'selectfield',
						name: 'type',
						id: 'typeSelectField',
						store: 'Types',
						flex: 1,
						cls: 'empty',
						
						// always use Ext.picker.Picker
						usePicker: true,
						defaultPhonePickerConfig: {
							cancelButton: 'Abbrechen',
							doneButton: 'Fertig'
						},
						defaultTabletPickerConfig: {
							cancelButton: 'Abbrechen',
							doneButton: 'Fertig'
						}
					}
				]
			},
			{
				xtype: 'mapnocenter',
				// fill the remaining space with the map
				flex: 1,
				id: 'reportMap',
				mapOptions: {
					zoom: FixMyStreet.util.Config.getMap().reportZoom
				}
			},
			{
				xtype: 'textfield',
				id: 'addressTextField',
				name: 'address',
				disabled: true
			},
			{
				xtype: 'button',
				id: 'reportButton',
				text: 'Jetzt melden',
				ui: 'normal',
				disabled: true
			}
		]
	}
});