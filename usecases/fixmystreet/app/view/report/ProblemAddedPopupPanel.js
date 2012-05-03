Ext.define('FixMyStreet.view.report.ProblemAddedPopupPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.problemaddedpopuppanel',
	
	config: {
		id: 'problemAddedPopupPanel',
		centered: true,
		width: 110,
		height: 110,
		showAnimation: 'pop',
		
		html:	'<div class="content">' +
					'<p>Problem gemeldet!</p>' +
				'</div>'
	}
});