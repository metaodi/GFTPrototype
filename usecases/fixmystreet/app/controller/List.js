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
			problemActionSheet: 'problemactionsheet',
			problemMap: '#problemMap',
			mainTabPanel: '#mainTabPanel'
		},
		control: {
			problemList: {
				itemtap: 'onProblemListItemTap',
				itemswipe: 'onProblemListItemSwipe'
			},
			problemActionSheet: {
				showonmaptap: 'onShowOnMapButtonTap',
				deletetap: 'onDeleteButtonTap',
				canceltap: 'onCancelButtonTap'
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
	
	onShowOnMapButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		var record = actionSheet.getRecord();
		actionSheet.hide();
		
		// show problem on map
		this.getProblemMap().setMapCenter(new google.maps.LatLng(record.getData().latitude, record.getData().longitude));
		this.getMainTabPanel().setActiveItem(2);
	},
	onDeleteButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		var record = actionSheet.getRecord();
		
		record.erase();
		actionSheet.hide();
	},
	onCancelButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		actionSheet.hide();
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