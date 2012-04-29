Ext.define("FixMyStreet.controller.List", {
	extend: "Ext.app.Controller",
	
	config: {
		views: [
			'list.ListContainer',
			'list.ProblemList',
			'list.ProblemActionSheet'
		],
		refs: {
			problemList: '#problemList',
			problemActionSheet: 'problemactionsheet button',
			problemMap: '#problemMap',
			mainTabPanel: '#mainTabPanel'
		},
		control: {
			problemList: {
				itemtap: 'onProblemListItemTap',
				itemswipe: 'onProblemListItemSwipe'
			},
			problemActionSheet: {
				tap: 'onProblemActionSheetButtonTap'
			}
		}
	},
	
	onProblemListItemTap: function(dataViewComp, index, target, record, e, eOpts) {
		this.showProblemOnMap(record);
	},
	onProblemListItemSwipe: function(dataViewComp, index, target, record, e, eOpts) {
		var actionSheet = this.getActionSheet();
		actionSheet.setRecord(record);
		
		Ext.Viewport.add(actionSheet);
		actionSheet.show();
	},
	
	onProblemActionSheetButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		var record = actionSheet.getRecord();
			
		if(buttonComp.getCls() == 'showonmap') {
			this.showProblemOnMap(record);
		} else if(buttonComp.getCls() == 'delete') {
			record.erase();
		}
		
		actionSheet.hide();
	},
	
	showProblemOnMap: function(record) {
		this.getProblemMap().setMapCenter(new google.maps.LatLng(record.getData().latitude, record.getData().longitude));
		this.getMainTabPanel().setActiveItem(2);
	},
	
    // Base Class functions.
    launch: function () {
        this.callParent(arguments);
    },
    init: function () {
        this.callParent(arguments);
		
		this.actionSheet = Ext.create('FixMyStreet.view.list.ProblemActionSheet');
    },
	
	getActionSheet: function() {
		return this.actionSheet;
	},
	setActionSheet: function(actionSheet) {
		this.actionSheet = actionSheet;
	}
});