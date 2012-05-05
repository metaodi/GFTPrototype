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
	
	resetRefreshState: function() {
        var me = this;

        me.isRefreshing = false;
        me.lastUpdated = new Date();

        me.setViewState('pull');
        me.updatedEl.setHtml(Ext.util.Format.date(me.lastUpdated, "d.m.Y H:i:s"));
    }
});