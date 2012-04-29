Ext.define('FixMyStreet.view.list.ProblemActionSheet', {
	extend: 'Ext.ActionSheet',
	alias: 'widget.problemactionsheet',
	
	config: {
		problem: null,
		cls: 'problemActionSheet',
		
		items: [
			{
				text: 'Auf Karte zeigen',
				cls: 'showonmap',
				handler: this.onShowOnMapButtonTap,
				scope: this

			},
			{
				text: 'Defekt löschen',
				ui: 'decline',
				cls: 'delete',
				handler: this.onDeleteButtonTap,
				scope: this
			},
			{
				text: 'Abbrechen',
				ui: 'action',
				cls: 'cancel',
				handler: this.onCancelButtonTap,
				scope: this
			}
		]
	},
	
	onShowOnMapButtonTap: function(buttonComp, e, eOpts) {
		console.log('bla');
		this.fireEvent('showonmaptap', buttonComp, this);
	},
	onDeleteButtonTap: function(buttonComp, e, eOpts) {
		console.log('bla');
		this.fireEvent('deletetap', buttonComp, this);
	},
	onCancelButtonTap: function(buttonComp, e, eOpts) {
		console.log('bla');
		this.fireEvent('canceltap', buttonComp, this);
	}
});