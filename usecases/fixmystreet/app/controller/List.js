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
			mainTabPanel: '#mainTabPanel',
			actionSheetShowOnMapButton: '#actionSheetShowOnMapButton',
			actionSheetDeleteButton: '#actionSheetDeleteButton',
			actionSheetCancelButton: '#actionSheetCancelButton',
			actionSheetTitlePanel: '#actionSheetTitlePanel'
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
		this.prepareActionSheet(record);
		
		Ext.Viewport.add(actionSheet);
		actionSheet.show();
	},
	
	prepareActionSheet: function(problem) {
		var actionSheet = this.getActionSheet();
		actionSheet.setProblem(problem);
		
		var data = problem.getData();
		
		// set actionsheet title
		var typeText = Ext.getStore('Types').getById(data.type).getData().text;
		this.getActionSheetTitlePanel().setHtml(typeText + ': ' + data.address);
		
		// show or hied delete button
		if(data.status != 'new') {
			this.getActionSheetDeleteButton().hide();
		} else {
			this.getActionSheetDeleteButton().show();
		}
	},
	
	onShowOnMapButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		var problem = actionSheet.getProblem();
		actionSheet.hide();
		
		this.showProblemOnMap(problem);
	},
	onDeleteButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		var problem = actionSheet.getProblem();
		
		Ext.getStore('Problems').remove(problem);
		
		actionSheet.hide();
	},
	onCancelButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		actionSheet.hide();
	},
	
	showProblemOnMap: function(problem) {
		// show problem on map
		this.getProblemMap().setMapCenter(new google.maps.LatLng(problem.getData().latitude, problem.getData().longitude));
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