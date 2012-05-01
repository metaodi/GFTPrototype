Ext.define('FixMyStreet.view.report.InfoPopupPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.infopopuppanel',
	
	config: {
		id: 'infoPopupPanel',
		top: 0,
		left: 0,
		modal: true,
		hideOnMaskTap: true,
		
		items: [
			{
				xtype: 'titlebar',
				title: 'Hilfe'
				// @TODO remove if not used
				/*items: [
					{
						iconCls: 'delete',
						iconMask: 'true',
						ui: 'plain',
						align: 'right',
						id: 'infoPopupCloseButton'
					}
				]*/
			},
			{
				xtype: 'panel',
				html:
					'<div class="content">' +
						'<ol>' +
							'<li>Typ des Defekts wählen.</li>' +
							'<li>Per Drag & Drop der Markierung auf der Karte den Standort des Defekts wählen.</li>' +
							'<li>Defekt melden.</li>' +
						'</ol>' +
					'</div>'
			}
		]
	}
});