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
				itemswipe: 'onProblemListItemSwipe'
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
		if(this.getActionSheet().isHidden()) {
			this.showProblemOnMap(record);
		}
	},
	onProblemListItemTapHold: function(dataViewComp, index, target, record, e, eOpts) {
		this.openActionSheet(record, target);
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
	cleanupActionSheet: function() {
		var actionSheet = this.getActionSheet();
		actionSheet.getListItem().removeCls('x-item-pressed');
		
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
		this.redirectTo('map/'+problem.getData().latitude+'/'+problem.getData().longitude);
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
					// match address and type
                    var didMatch = record.get('address').match(search) || me.getTypeStore().getById(record.get('type')).getData().text.match(search);

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