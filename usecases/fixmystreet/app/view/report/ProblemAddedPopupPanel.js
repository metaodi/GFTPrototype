Ext.define('FixMyStreet.view.report.ProblemAddedPopupPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.problemaddedpopuppanel',
	
	config: {
		id: 'problemAddedPopupPanel',
		centered: true,
		showAnimation: {
			type: 'pop',
			duration: 150
		},
		hideAnimation: {
			type: 'popOut',
			duration: 150
		},
		
		html:	'<div class="content">' +
					'<p>Problem gemeldet</p>' +
				'</div>',
		
		listeners: {
			show: function(panelComp, eOpts) {
				// automatically hide panel after certain time
				Ext.defer(function() {
					this.hide();
				}, 2000, this);
			}
		}
	}
});