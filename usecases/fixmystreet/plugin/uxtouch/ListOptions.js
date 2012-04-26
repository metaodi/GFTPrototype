Ext.ns('Ext.plugin.uxtouch');

Ext.define('Ext.plugin.uxtouch.ListOptions', {
    extend: 'Ext.mixin.Observable',
    alias : 'plugin.listoptions',
	
	
	//config: {
		/**
		* Selector to use to get the dynamically created List Options Ext.Element (where the menu options are held)
		* Once created the List Options element will be used again and again.
		*/
		optionsSelector: 'x-list-options',

		/**
		* An array of objects to be applied to the 'listOptionsTpl' to create the 
		* menu
		*/
		menuOptions: [],

		/**
		* Selector to use to get individual List Options within the created Ext.Element
		* This is used when attaching event handlers to the menu options
		*/
		menuOptionSelector: 'x-menu-option',

		/**
		* XTemplate to use to create the List Options view
		*/
		menuOptionsTpl: new Ext.XTemplate(	'<ul>',
												'<tpl for=".">',											
													'<li class="x-menu-option {cls}">',
													'</li>',
												'</tpl>',
											'</ul>').compile(),

		/**
		* CSS Class that is applied to the tapped Menu Option while it is being touched
		*/		
		menuOptionPressedClass: 'x-menu-option-pressed',

		/**
		* Set to a function that takes in 2 arguments - your initial 'menuOptions' config option and the current 
		* item's Model instance
		* The function must return either the original 'menuOptions' variable or a revised one
		*/
		menuOptionDataFilter: null,

		/**
		* Animation used to reveal the List Options
		*/
		revealAnimation: {
			reverse: false,
			type: 'slide',
			duration: 500
		},

		/**
		* The direction the List Item will slide to reveal the List Options
		* Possible values: 'left', 'right' and 'both'
		* setting to 'both' means it will be decided by the direction of the User's swipe if 'triggerEvent' is set to 'itemswipe'
		*/
		revealDirection: 'both',

		/**
		* Distance (in pixels) a User must swipe before triggering the List Options to be displayed.
		* Set to -1 to disable threshold checks
		*/
		swipeThreshold: 30,

		/**
		* The direction the user must swipe to reveal the menu
		* Only applicable when 'triggerEvent' is set to 'itemswipe'
		*/
		swipeDirection: 'both',

		/**
		* Ext.DataView event used to trigger the menu reveal
		* Usual values are 'itemswipe', 'itemtap', 'itemdoubletap'
		* Notes:
		* itemswipe: see configs 'swipeThreshold' & 'swipeDirection'
		*/
		triggerEvent: 'itemswipe',

		/**
		* Stops the List from scrolling when a List Options menu is about to be opened
		*/
		stopScrollOnShow: true,

		/**
		* Decides whether the visible List Options menu is hidden when the List is scrolled
		*/
		hideOnScroll: false,

		/**
		* Decides whether multiple List Options can be visible at once
		*/
		allowMultiple: false,
	//},
	
    init: function(parent){
		var me = this;
        me.parent = parent;
        
		me.parent.on(me.triggerEvent, me.onItemSwipe, me);
		
        this.parent.on({
            painted: me.onAfterRender,
			destroy: me.onListDestroy,
            scope: me
        });
		
		this.parent.addEvents({
			'menuoptiontap': true,
			'listoptionsopen': true,
			'listoptionsclose': true,
			'beforelistoptionstap': true
		});
    },
	
	/**
	 * Destroy listeners when destroying list
	 */
	onListDestroy: function(){
		var me = this;
		me.parent.removeListener(me.triggerEvent, me.onItemSwipe, me);
		me.parent.removeListener('painted', me.onAfterRender, me);
		me.parent.scroller.removeListener('scrollstart', me.hideOptionsMenu, me);	
	},
    
	/**
	 * Handles the 'afterrender' event
	 * Attaches the handler to the List's scroller
	 */
    onAfterRender: function(){
		var me = this;
		
		if(me.hideOnScroll) {
			me.parent.getScrollable().on({
				scrollstart: Ext.Function.bind(me.hideOptionsMenu, me, [], false),
				scope: me
			});
		}
		
		// add plugin class to the list so its special styles aren't applied globally
		this.parent.addCls('x-list-options-plugin');
    },
	
	/**
	 * Handler for the List's 'itemswipe' event
	 * Hides any visible List Options
	 * Caches the List Item we're working with
	 * Sets some styles needed for it to look right
	 * Shows the List Options
	 * @param {Object} dataView
	 * @param {Object} index
	 * @param {Object} item
	 * @param {Object} e
	 */
    onItemSwipe: function(listComp, index, target, record, e, eOpts){
		var me = this;
		
		// check we're over the 'swipethreshold'
		if(me.revealAllowed(e.direction, e.distance)){
			
			// set the direction of the reveal
			me.setRevealDirection(e.direction);

			// cache the current List Item's elements for easy use later
			me.activeListItemRecord = listComp.getStore().getAt(index);
			
			var activeEl = Ext.get(target);
				
			me.activeListElement = activeEl;
			
			if(!me.allowMultiple) {
				// hide any visible List Options
				me.hideOptionsMenu();
			}			
			
			activeEl.setVisibilityMode(Ext.Element.VISIBILITY);

			// Show the item's List Options
			me.doShowOptionsMenu(activeEl);
		}
    },
	
	/**
	 * Decide whether the List Options are allowed to be revealed based on the config options
	 * Only relevant for 'itemswipe' event because this event has all the config options
	 * @param {Object} direction
	 * @param {Object} distance
	 */
	revealAllowed: function(direction, distance){
		var allowed = true;
		if(this.triggerEvent === 'itemswipe'){
			// check swipe is long enough
			// check direction of swipe is correct
			allowed = (distance >= this.swipeThreshold && (direction === this.swipeDirection || this.swipeDirection === 'both')) || this.swipeThreshold < 0;
		}
		return allowed;
	},
	
	/**
	 * Decide the direction the reveal animation will go
	 * this.revealDirection config can only be 'both' when triggerEvent is 'itemswipe' in which case
	 * the direction of the swipe is used
	 * @param {Object} direction
	 */
	setRevealDirection: function(direction){
		var dir = this.revealDirection;
		if(this.revealDirection === 'both' && this.triggerEvent === 'itemswipe'){
			dir = direction;
		}
		
		Ext.apply(this.revealAnimation, {
			direction: dir
		});
	},
	
	/**
	 * Hides the List Options menu for the specified record or, if that is not defined, hides all List Options
	 * @param {Object} record - A record 
	 */
	hideOptionsMenu: function(record){
		if(record) {
			var node = this.parent.getNode(record),
				listOptions = Ext.get(node).next('.' + this.optionsSelector);
			
			if (node && listOptions) {
				this.doHideOptionsMenu(Ext.get(node), listOptions);
			}
		} else {
			var multiListOptions = this.parent.getInnerHtmlElement().select('.' + this.optionsSelector);
			
			for(var i = 0; i < multiListOptions.elements.length; i++){
				this.doHideOptionsMenu(Ext.get(multiListOptions.elements[i]).prev('.x-list-item'), Ext.get(multiListOptions.elements[i]));
			}
		}
	},
    
	/**
	 * Performs the List Options animation and hide
	 * @param {Object} hiddenEl - the List Item that is hidden
	 * @param {Object} activeListOptions - the List Options element that is visible
	 */
    doHideOptionsMenu: function(hiddenEl, activeListOptions){
		
		// reverse the configured animation so it looks like its going back
        Ext.apply(this.revealAnimation, {
            reverse: true
        });
		
		// Run the animation on the List Item's 'body' Ext.Element
		Ext.Anim.run(hiddenEl, this.revealAnimation, {
			out: false,
			before: function(){
				// force the List Options to the back
				activeListOptions.setStyle('z-index', '0');
				
				// show the List Item's 'body' so the animation can be seen
				hiddenEl.show();
			},
			after: function(){
				hiddenEl.show();
				hiddenEl.setVisibilityMode(Ext.Element.DISPLAY);
				
				// remove the ListOptions DIV completely to save some resources
				activeListOptions.remove();
				Ext.removeNode(Ext.getDom(activeListOptions));
				
				this.parent.fireEvent('listoptionsclose');
			},
			scope: this
		});
    },
    
	/**
	 * Perform the List Option animation and show
	 * @param {Object} listItemEl - the List Item's element to show a menu for
	 */
    doShowOptionsMenu: function(listItemEl){
		if(this.stopScrollOnShow){
			this.parent.getScrollable().suspendEvents();
		}
		
		// ensure the animation is not reversed
        Ext.apply(this.revealAnimation, {
            reverse: false
        });
       
		// Do the animation on the current 
        Ext.Anim.run(listItemEl, this.revealAnimation, {
            out: true,
            before: function(){
				// Create the List Options Ext.Element
                this.createOptionsMenu(listItemEl);
            },
            after: function(){
                listItemEl.hide(); // hide the List Item
                
				this.parent.fireEvent('listoptionsopen');
				
				// re-enable the scroller
				if (this.stopScrollOnShow) {
					this.parent.getScrollable().resumeEvents();
				}
            },
            scope: this
        });
    },
	
	/**
	 * Used to process the menuOptions data prior to applying it to the menuOptions template
	 */
	processMenuOptionsData: function(){
		return (Ext.isFunction(this.menuOptionDataFilter)) ? this.menuOptionDataFilter(this.menuOptions, this.activeListItemRecord) : this.menuOptions;
	},
    
	/**
	 * Get the existing or create a new List Options Ext.Element and return and cache it
	 * @param {Object} listItem
	 */
    createOptionsMenu: function(listItemEl){
		var listItemElHeight = listItemEl.getHeight();
		
		// Create the List Options element
		this.activeListOptions = Ext.DomHelper.insertAfter(listItemEl, {
            cls: this.optionsSelector,
            html: this.menuOptionsTpl.apply(this.processMenuOptionsData())
        }, true).setHeight(listItemElHeight).setStyle('margin-top', (-1 * listItemElHeight) + 'px');
        
		// Add tap handlers to the List Option's menu items
        this.on(this.activeListOptions.select('.' + this.menuOptionSelector), {
			touchstart: this.onListOptionTabStart,
            touchend: this.onListOptionTapEnd,
			tapcancel: this.onListOptionTabCancel,
            scope: this
        });
		
		// attach event handler to options element to close it when tapped
		this.on(this.activeListOptions, {
			tap: Ext.Function.bind(this.doHideOptionsMenu, this, [this.activeListElement, this.activeListOptions], false),
			scope: this
		});
        
        return this.activeListOptions;
    },
	
	/**
	 * Handler for 'touchstart' event to add the Pressed class
	 * @param {Object} e
	 * @param {Object} el
	 */
	onListOptionTabStart: function(e, el){
		var menuOption = e.getTarget('.' + this.menuOptionSelector);
		
		// BUGFIX: menuOption can be null
		if(menuOption != null) {
			var listOptionsEl = Ext.get(Ext.get(menuOption).findParent('.' + this.optionsSelector)).prev('.x-list-item');

			// get the menu item's data
			var menuItemData = this.processMenuOptionsData()[this.getIndex(menuOption)];

			if (this.parent.fireEvent('beforelistoptionstap', menuItemData, this.parent.getRecord(listOptionsEl.dom)) === true) {
				this.addPressedClass(e);
			} else {
				this.TapCancelled = true;
			}
		} else {
			this.TapCancelled = true;
		}
		
	},
	
	/**
	 * Handler for 'tapcancel' event
	 * Sets TapCancelled value to stop TapEnd function from executing and removes Pressed class
	 * @param {Object} e
	 * @param {Object} el
	 */
	onListOptionTabCancel: function(e, el){
		this.TapCancelled = true;
		this.removePressedClass(e);
	},
	
	/**
	 * Handler for the 'tap' event of the individual List Option menu items
	 * @param {Object} e
	 */
	onListOptionTapEnd: function(e, el){
		if (!this.TapCancelled) {
			// Remove the Pressed class
			this.removePressedClass(e);
			
			var menuOption = e.getTarget('.' + this.menuOptionSelector),
				listOptionsEl = Ext.get(Ext.get(menuOption).findParent('.' + this.optionsSelector)).prev('.x-list-item');
			
			// get the menu item's data
			var menuItemData = this.processMenuOptionsData()[this.getIndex(menuOption)];
			
			this.parent.fireEvent('menuoptiontap', menuItemData, this.parent.getRecord(listOptionsEl.dom));
		}
		this.TapCancelled = false;
		
		// stop menu from hiding
		e.stopPropagation();
	},
	
	/**
	 * Adds the Pressed class on the Menu Option
	 * @param {Object} e
	 */
	addPressedClass: function(e){
		if (Ext.fly(e.getTarget('.' + this.menuOptionSelector))) {
			Ext.fly(e.getTarget('.' + this.menuOptionSelector)).addCls(this.menuOptionPressedClass);
		}		
	},
	
	/**
	 * Removes the Pressed class on the Menu Option
	 * @param {Object} e
	 */
	removePressedClass: function(e){
		if (Ext.fly(e.getTarget('.' + this.menuOptionSelector))) {
			Ext.fly(e.getTarget('.' + this.menuOptionSelector)).removeCls(this.menuOptionPressedClass);
		}		
	},
	
	/**
	 * Helper method to get the index of the List Option that was tapped
	 * @param {Object} el - the tapped node
	 */
	getIndex: function(el){
		var listOptions = Ext.get(Ext.get(el).findParent('.' + this.optionsSelector)).select('.' + this.menuOptionSelector);
		
		for(var i = 0; i < listOptions.elements.length; i++){
			if(listOptions.elements[i].id === el.id){
				return i;
			}
		}
		return -1;
	}  
    
});