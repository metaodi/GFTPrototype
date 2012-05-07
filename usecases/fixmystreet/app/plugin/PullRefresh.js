Ext.define('FixMyStreet.plugin.PullRefresh', {
    extend: 'Ext.plugin.PullRefresh',
    alias: 'plugin.problempullrefresh',
	
	config: {
		pullRefreshText: 'Zum Aktualisieren herunterziehen',
		releaseRefreshText: 'Zum Aktualisieren loslassen...',
		loadingText: 'wird aktualisiert...',
		pullTpl: [
            '<div class="x-list-pullrefresh">',
                '<div class="x-list-pullrefresh-arrow"></div>',
                '<div class="x-loading-spinner">',
                    '<span class="x-loading-top"></span>',
                    '<span class="x-loading-right"></span>',
                    '<span class="x-loading-bottom"></span>',
                    '<span class="x-loading-left"></span>',
                '</div>',
                '<div class="x-list-pullrefresh-wrap">',
                    '<h3 class="x-list-pullrefresh-message">{message}</h3>',
                    '<div class="x-list-pullrefresh-updated">Zuletzt aktualisiert: <span>{lastUpdated:date("d.m.Y H:i:s")}</span></div>',
                '</div>',
            '</div>'
        ].join('')
	},
	
	/**
	 * OVERRIDEN SENCHA TOUCH FUNCTION
	 * CHANGE: German date format
	 */ 
	resetRefreshState: function() {
        var me = this;

        me.isRefreshing = false;
        me.lastUpdated = new Date();

        me.setViewState('pull');
		// CHANGE: German date format
        me.updatedEl.setHtml(Ext.util.Format.date(me.lastUpdated, "d.m.Y H:i:s"));
    },
	
	/**
	 * OVERRIDEN SENCHA TOUCH FUNCTION
	 * CHANGE: wait for a longer time to scroll to top
	 */
	loadStore: function() {
        var me = this,
            list = me.getList(),
            scroller = list.getScrollable().getScroller();

        me.setViewState('loading');
        me.isReleased = false;

        Ext.defer(function() {
            scroller.on({
                scrollend: function() {
                    if (me.getRefreshFn()) {
                        me.getRefreshFn().call(me, me);
                    } else {
                        me.fetchLatest();
                    }
                    me.resetRefreshState();
                },
                delay: 100,
                single: true,
                scope: me
            });
            scroller.minPosition.y = 0;
            scroller.scrollTo(null, 0, true);
		// CHANGE: wait for a longer time to scroll to top
        }, 1000, me);
    }
});