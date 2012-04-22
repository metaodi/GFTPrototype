Ext.define('FixMyStreet.view.report.ReportContainer', {
	extend: 'Ext.Container',
	alias: 'widget.reportcontainer',

	config: {
		title: 'Melden',
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
				xtype: 'selectfield',
				name: 'problemType',
				store: 'ProblemTypes',
				defaultPhonePickerConfig: {
					cancelButton: 'Abbrechen',
					doneButton: 'Fertig'
				},
				defaultTabletPickerConfig: {
					cancelButton: 'Abbrechen',
					doneButton: 'Fertig'
				}
			},
			{
				xtype: 'reportmap',
				// fill the remaining space with the map
				flex: 1
			},
			{
				xtype: 'textfield',
				id: 'addressTextField',
				label: 'Adresse',
				labelWidth: '5em',
				name: 'address',
				disabled: true
			},
			{
				xtype: 'button',
				id: 'reportButton',
				text: 'Jetzt melden',
				ui: 'action',
				disabled: true
			}
		]
	}
});