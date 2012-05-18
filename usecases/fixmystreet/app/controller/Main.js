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
			}
		},
		routes: {
			'report': 'showReport',
			'list': 'showList',
			'map': 'showMap',
			'map/:lat/:lng': {
                action: 'showMap',
				// only allow floating numbers for latitude and longitude
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
		Ext.Logger.log('mainTabPanel initalized (viewName: ' + viewName + ', lat: ' + this.getInitLat() + ', lng: ' + this.getInitLng() + ')');
		
		// if initial view is set redirect to this view
		if (viewName) {
			Ext.Logger.log('redirect to ' + viewName);
			if (this.getInitLat()) {
				this.redirectTo(viewName + '/' + this.getInitLat() + '/' + this.getInitLng());
			} else {
				this.redirectTo(viewName);
			}
			this.setInitView(null);
		}
	},
	
	// shows report view
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
	
	centerMap: function(lat,lng) {
		if(this.getProblemMap() && lat && lng) {
			if(this.getFirstProblemMapCall()) {
				// @TODO ugly timeout to center map correctly on first call (wait till map is correctly rendered)
				Ext.defer(function() {
					this.centerMap(lat,lng);
				}, 500, this);
			} else {
				this.getProblemMap().setMapCenter(new google.maps.LatLng(this.getInitLat(), this.getInitLng()));
				this.getProblemMap().getMap().setZoom(FixMyStreet.util.Config.getMap().reportZoom);

				this.setInitLat(null);
				this.setInitLng(null);
			}
		}
		this.setFirstProblemMapCall(false);
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
		if (this.getMainTabPanel()) {
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
		me.firstProblemMapCall = true;
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
	},
	getFirstProblemMapCall: function() {
		return this.firstProblemMapCall;
	},
	setFirstProblemMapCall: function(firstProblemMapCall) {
		this.firstProblemMapCall = firstProblemMapCall;
	}
});