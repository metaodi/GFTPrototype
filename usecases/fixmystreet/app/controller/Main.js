Ext.define("FixMyStreet.controller.Main", {
	extend: "Ext.app.Controller",
	
	config: {
		views: [
			'MainContainer'
		],
		refs: {
			mainTabPanel: '#mainTabPanel',
			problemMap: '#problemMap'
		},
		control: {
			mainTabPanel: {
				activeitemchange: 'onMainTabPanelActiveItemChange',
				initialize: 'onMainTabPanelInitialize'
			},
			problemMap: {
				maprender: 'onProblemMapRender'
			}
		},
		routes: {
			'report': 'showReport',
			'list': 'showList',
			'map': 'showMap',
			'map/:lat/:lng': {
                action: 'showMap',
                conditions: {
                    ':lat': "[0-9]+\.+[0-9]+",
					':lng': "[0-9]+\.+[0-9]+"
				}
			}
        }
	},
	
	onMainTabPanelActiveItemChange: function(container, value, oldValue, eOpts) {
		if (this.getRedirect()) {
			this.redirectTo(value.getUrl());
		}
	},
	
	onMainTabPanelInitialize: function(container, eOpts) {
		var viewName = this.getInitView();
		Ext.Logger.log('mainTabPanel initalized (viewName: ' + viewName+ ', lat: ' + this.getInitLat() + ', lng: ' + this.getInitLng() + ')');
		if (viewName !== null) {
			this.initView = null;
			if (this.initLat !== null) {
				this.redirectTo(viewName + '/' + this.getInitLat() + '/' + this.getInitLng());
			} else {
				this.redirectTo(viewName);
			}
		}
	},
	
	onProblemMapRender: function() {
		this.centerMap(this.getInitLat(),this.getInitLng());
	},
	
	centerMap: function(lat,lng) {
		if (this.getProblemMap !== undefined && this.getProblemMap() !== undefined) {
			if (lat && lng) {
				this.getProblemMap().setMapCenter(new google.maps.LatLng(this.getInitLat(), this.getInitLng()));
				this.getProblemMap().getMap().setZoom(FixMyStreet.util.Config.getMap().reportZoom);
				
				this.setInitLat(null);
				this.setInitLng(null);
			}
		}
	},
	
	showReport: function() {
		var viewName = 'report';
		this.saveInitView(viewName);
		this.switchView(viewName);
	},
	
	showList: function() {
		var viewName = 'list';
		this.saveInitView(viewName);
		this.switchView(viewName);
	},
	
	showMap: function(lat,lng) {
		var viewName = 'map';
		this.saveInitView(viewName, lat, lng);
		this.switchView(viewName);
		this.centerMap(lat,lng);
	},
	
	saveInitView: function(viewName, lat, lng) {
		if (lat) {
			this.setCenterToOwnPosition(false);
		}
		this.setInitView(viewName);
		this.setInitLat(lat);
		this.setInitLng(lng);
	},
	
	switchView: function(viewName) {
		if (this.getMainTabPanel() !== undefined) {
			var viewNr = this.getViewNr(viewName);
			this.setRedirect(false);
			this.getMainTabPanel().setActiveItem(viewNr);
			this.setRedirect(true);
		}
	},
	
	init: function () {
		var me = this;
		me.initView = null;
		me.initLat = null;
		me.initLng = null;
		me.redirect = true;
		me.centerToOwnPosition = true;
	},
	
	getViewNr: function(viewName) {
		var views = {
			'report': 0,
			'list': 1,
			'map': 2
		};
		return views[viewName];
	},
	
	getInitView: function() {
		return this.initView;
	},
	setInitView: function(initView) {
		this.initView = initView;
	},
	getInitLat: function() {
		return this.initLat;
	},
	setInitLat: function(lat) {
		this.initLat = lat;
	},
	getInitLng: function() {
		return this.initLng;
	},
	setInitLng: function(lng) {
		this.initLng = lng;
	},
	getRedirect: function() {
		return this.redirect;
	},
	setRedirect: function(redirect) {
		this.redirect = redirect;
	},
	getCenterToOwnPosition: function() {
		return this.centerToOwnPosition;
	},
	setCenterToOwnPosition: function(centerToOwnPosition) {
		this.centerToOwnPosition = centerToOwnPosition;
	}
});