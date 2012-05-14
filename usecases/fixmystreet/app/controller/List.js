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
			actionSheetShowOnMapButton: '#actionSheetShowOnMapButton',
			actionSheetDeleteButton: '#actionSheetDeleteButton',
			actionSheetCancelButton: '#actionSheetCancelButton',
			actionSheetTitlePanel: '#actionSheetTitlePanel',
			searchField: '#problemListSearchField',
			mainTabPanel: '#mainTabPanel'
		},
		control: {
			problemList: {
				itemtap: 'onProblemListItemTap',
				itemtaphold: 'onProblemListItemTapHold',
				itemswipe: 'onProblemListItemSwipe',
				itemtouchmove: 'onProblemListItemTouchMove',
				itemtouchend: 'onProblemListItemTouchEnd'
			},
			problemActionSheet: {
				showonmaptap: 'onShowOnMapButtonTap',
				deletetap: 'onDeleteButtonTap',
				canceltap: 'onCancelButtonTap'
			},
			searchField: {
				clearicontap: 'onSearchClearIconTap',
				keyup: 'onSearchKeyUp'
			}
		}
	},
	
	onProblemListItemTap: function(dataViewComp, index, target, record, e, eOpts) {
		if(!this.getActionSheet().isPainted()) {
			this.showProblemOnMap(record);
		}
	},
	onProblemListItemTapHold: function(dataViewComp, index, target, record, e, eOpts) {
		// disabled scrolling when action sheet opens
		dataViewComp.getScrollable().getScroller().setDisabled(true);
		this.openActionSheet(record, target);
	},
	onProblemListItemTouchMove: function(dataViewComp, index, target, record, e, eOpts) {
		if(this.getActionSheet().isPainted()) {
			// do not remove pressed class when action sheet is shown
			target.addCls('x-item-pressed');
		}
	},
	onProblemListItemTouchEnd: function(dataViewComp, index, target, record, e, eOpts) {
		if(this.getActionSheet().isPainted()) {
			// do not remove pressed class when action sheet is shown
			target.addCls('x-item-pressed');
		}
	},
	onProblemListItemSwipe: function(dataViewComp, index, target, record, e, eOpts) {
		this.openActionSheet(record, target);
	},
	
	openActionSheet: function(record, target) {
		var actionSheet = this.getActionSheet();
		this.prepareActionSheet(record, target);
		target.addCls('x-item-pressed');
		
		Ext.Viewport.add(actionSheet);
		actionSheet.show();
	},
	
	prepareActionSheet: function(problem, item) {
		var actionSheet = this.getActionSheet();
		actionSheet.setProblem(problem);
		actionSheet.setListItem(item);
		
		// set actionsheet title
		// get type
		var type = Ext.getStore('Types').getById(problem.get('type'));
		var typeText = problem.get('type');
		if(type) {
			typeText = type.get('text');
		}
		this.getActionSheetTitlePanel().setHtml(typeText + ': ' + problem.get('address'));
		
		// show or hied delete button
		if(problem.get('status') != 'new') {
			this.getActionSheetDeleteButton().hide();
		} else {
			this.getActionSheetDeleteButton().show();
		}
	},
	cleanupActionSheet: function() {
		var actionSheet = this.getActionSheet();
		actionSheet.getListItem().removeCls('x-item-pressed');
		
		// enable scrolling when action sheet closes (disabled in taphold event)
		this.getProblemList().getScrollable().getScroller().setDisabled(false);
		
		actionSheet.hide();
	},
	
	onShowOnMapButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		var problem = actionSheet.getProblem();
		
		this.cleanupActionSheet();
		
		this.showProblemOnMap(problem);
	},
	onDeleteButtonTap: function(buttonComp, e, eOpts) {
		var actionSheet = this.getActionSheet();
		var problem = actionSheet.getProblem();
		
		this.cleanupActionSheet();
		
		this.getProblemStore().remove(problem);
	},
	onCancelButtonTap: function(buttonComp, e, eOpts) {
		this.cleanupActionSheet();
	},
	
	showProblemOnMap: function(problem) {
		var locationArray = problem.get('location').split(FixMyStreet.util.Config.getFusionTable().latlngSeparator, 2);
		this.redirectTo('map/' + locationArray[0] + '/' + locationArray[1]);
	},
	
	/**
     * Called when the search field has a keyup event.
     *
     * This will filter the store based on the fields content.
     */
    onSearchKeyUp: function(field) {
        //get the store and the value of the field
		var me = this;
        var value = field.getValue();
        var store = me.getProblemStore();

        //first clear any current filters on thes tore
        store.clearFilter();

        //check if a value is set first, as if it isnt we dont have to do anything
        if (value) {
            //the user could have entered spaces, so we must split them so we can loop through them all
            var searches = value.split(' '),
                regexps = [],
                i;

            //loop them all
            for (i = 0; i < searches.length; i++) {
                //if it is nothing, continue
                if (!searches[i]) continue;

                //if found, create a new regular expression which is case insenstive
                regexps.push(new RegExp(searches[i], 'i'));
            }

            //now filter the store by passing a method
            //the passed method will be called for each record in the store
            store.filter(function(record) {
                var matched = [];

                //loop through each of the regular expressions
                for (i = 0; i < regexps.length; i++) {
                    var search = regexps[i];
					
					// get type
					var type = me.getTypeStore().getById(record.get('type'));
					var typeText = record.get('type');
					if(type) {
						typeText = type.get('text');
					}
					
					// match address and type
                    var didMatch = record.get('address').match(search) || typeText.match(search);

                    //if it matched the first or last name, push it into the matches array
                    matched.push(didMatch);
                }

                //if nothing was found, return false (dont so in the store)
                if (regexps.length > 1 && matched.indexOf(false) != -1) {
                    return false;
                } else {
                    //else true true (show in the store)
                    return matched[0];
                }
            });
        }
    },

    /**
     * Called when the user taps on the clear icon in the search field.
     * It simply removes the filter form the store
     */
    onSearchClearIconTap: function() {
        //call the clearFilter method on the store instance
        this.getProblemStore().clearFilter();
    },
	
    // Base Class functions.
    launch: function () {
        this.callParent(arguments);
    },
    init: function () {
		var me = this;
        me.callParent(arguments);
		
		me.problemStore = Ext.getStore('Problems');
		me.typeStore = Ext.getStore('Types');
		me.actionSheet = Ext.create('FixMyStreet.view.list.ProblemActionSheet');
    },
	
	getProblemStore: function() {
		return this.problemStore;
	},
	getTypeStore: function() {
		return this.typeStore;
	},
	getActionSheet: function() {
		return this.actionSheet;
	}
});