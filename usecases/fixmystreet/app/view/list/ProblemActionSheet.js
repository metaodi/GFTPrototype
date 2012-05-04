Ext.define('FixMyStreet.view.list.ProblemActionSheet', {
	extend: 'Ext.ActionSheet',
	alias: 'widget.problemactionsheet',
	
	config: {
		problem: null,
		cls: 'problemActionSheet'
	},
	
	initialize: function() {
		var problemTitlePanel = Ext.create('Ext.Panel', {
			id: 'actionSheetTitlePanel'
		});
		var showOnMapButton = Ext.create('Ext.Button', {
			id: 'actionSheetShowOnMapButton',
			text: 'Auf Karte zeigen',
			cls: 'showonmap',
			handler: this.onShowOnMapButtonTap,
			scope: this
		});
		var deleteButton = Ext.create('Ext.Button', {
			id: 'actionSheetDeleteButton',
			text: 'Defekt löschen',
			ui: 'decline',
			cls: 'delete',
			handler: this.onDeleteButtonTap,
			scope: this
		});
		var cancelButton = Ext.create('Ext.Button', {
			id: 'actionSheetCancelButton',
			text: 'Abbrechen',
			ui: 'action',
			cls: 'cancel',
			handler: this.onCancelButtonTap,
			scope: this
		});
		this.add([problemTitlePanel, showOnMapButton, deleteButton, cancelButton]);
	},
	
	onShowOnMapButtonTap: function(buttonComp, e, eOpts) {
		this.fireEvent('showonmaptap', buttonComp, this);
	},
	onDeleteButtonTap: function(buttonComp, e, eOpts) {
		this.fireEvent('deletetap', buttonComp, this);
	},
	onCancelButtonTap: function(buttonComp, e, eOpts) {
		this.fireEvent('canceltap', buttonComp, this);
	}
});