Ext.define("FixMyStreet.controller.Main", {
	extend: "Ext.app.Controller",
	
	config: {
		views: [
			'MainContainer'
		],
		refs: {
			mainTabPanel: '#mainTabPanel'
		},
		control: {
			mainTabPanel: {
				activeitemchange: 'onMainTabPanelActiveItemChange'
			}
		}
	},
	
	onMainTabPanelActiveItemChange: function() {
		this.redirectTo(value.getUrl());
	}
});