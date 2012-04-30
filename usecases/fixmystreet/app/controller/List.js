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
			actionSheetTitlePanel: '#actionSheetTitlePanel',
			searchField: '#problemListSearchField',
			filterPopupButton: '#filterPopupButton'
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
			},
			searchField: {
				clearicontap: 'onSearchClearIconTap',
				keyup: 'onSearchKeyUp'
			},
			filterPopupButton: {
				tap: 'onFilterPopupButtonTap'
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
		
		this.getProblemStore().remove(problem);
		
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
	
	onFilterPopupButtonTap: function(buttonComp, e, eOpts) {
		this.getFilterPopupPanel().showBy(this.getFilterPopupButton());
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
					// match address
                    var didMatch = record.get('address').match(search);

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
        this.callParent(arguments);
		
		this.problemStore = Ext.getStore('Problems');
		this.typeStore = Ext.getStore('Types');
		this.actionSheet = Ext.create('FixMyStreet.view.list.ProblemActionSheet');
		
		// prepare filter popup panel
		this.filterPopupPanel = Ext.create('Ext.Panel', {
			id: 'filterPopupPanel',
			top: 0,
			left: 0
		});
		var fieldset = Ext.create('Ext.form.FieldSet', {
			title: 'Typ-Filter',
			cls: 'typeFilterFieldSet'
		});
		this.typeStore.each(function(type) {
			if(type.getData().value != 'undefined') {
				var checkbox = Ext.create('Ext.field.Checkbox', {
					name: type.getData().value,
					label: type.getData().text,
					checked: true,
					labelWidth: '70%'
				})
				fieldset.add(checkbox);
			}
		});
		var applyButton = Ext.create('Ext.Button', {
			text: 'Filter anwenden',
			ui: 'confirm',
			cls: 'typeFilterApplyButton'
		})
		
		this.filterPopupPanel.add([fieldset, applyButton]);
		this.filterPopupPanel.setModal(true);
    },
	
	getProblemStore: function() {
		return this.problemStore;
	},
	getTypeStore: function() {
		return this.typeStore;
	},
	getActionSheet: function() {
		return this.actionSheet;
	},
	getFilterPopupPanel: function() {
		return this.filterPopupPanel;
	}
});