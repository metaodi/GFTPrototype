Ext.define('FixMyStreet.view.list.ProblemActionSheet', {
	extend: 'Ext.ActionSheet',
	alias: 'widget.problemactionsheet',
	
	config: {
		problem: null,
		cls: 'problemActionSheet'
	},
	
	initialize: function() {
		var showOnMapButton = new Ext.Button({
			text: 'Auf Karte zeigen',
			cls: 'showonmap',
			handler: this.onShowOnMapButtonTap,
			scope: this
		});
		var deleteButton = new Ext.Button({
			text: 'Defekt löschen',
			ui: 'decline',
			cls: 'delete',
			handler: this.onDeleteButtonTap,
			scope: this
		});
		var cancelButton = new Ext.Button({
			text: 'Abbrechen',
			ui: 'action',
			cls: 'cancel',
			handler: this.onCancelButtonTap,
			scope: this
		});
		this.add([showOnMapButton, deleteButton, cancelButton]);
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