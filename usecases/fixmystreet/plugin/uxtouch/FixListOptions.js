Ext.define('Ext.plugin.uxtouch.FixListOptions', {
	extend: 'Ext.plugin.uxtouch.ListOptions',
	alias: 'plugin.fixlistoptions',
	
		revealDirection: 'both',
		swipeDirection: 'both',
		hideOnScroll: true,
		menuOptions: [{
			id: 'favorite',
			cls: 'favorite',
			enabled: true
		}],

		/**
		* XTemplate to use to create the List Options view
		*/
		menuOptionsTpl: new Ext.XTemplate(	'<ul>',
												'<tpl for=".">',											
													'<li class="x-menu-option">',
														'<div class="x-menu-option-image {cls}"></div>',
													'</li>',
												'</tpl>',
											'</ul>').compile()
});