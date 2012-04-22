Ext.define("FixMyStreet.controller.List", {
	extend: "Ext.app.Controller",
	
	config: {
		views: [
			'list.ListContainer',
			'list.ProblemList'
		],
		refs: {
			problemList: '#problemList'
		},
		control: {
			problemList: {
				initialize: 'onProblemListInitialize'
			}
		}
	},
	
	onProblemListInitialize: function(listComp, eOpts) {
		this.getProblemList().setStore(this.getProblemStore());
	},
	
    // Base Class functions.
    launch: function () {
        this.callParent(arguments);
    },
    init: function () {
        this.callParent(arguments);
		
		this.problemStore = Ext.getStore('Problems');
    },
	
	getProblemStore: function() {
		return this.problemStore;
	},
	setProblemStore: function(problemStore) {
		this.problemStore = problemStore;
	}
});