module("FixMyStreet-Availability");

test("Ext.Logger", function() {
	notStrictEqual(Ext.Logger, undefined, "Ext.Logger should be defined");
	notStrictEqual(Ext.Logger.log, undefined, "Ext.Logger.log should be defined");
	notStrictEqual(Ext.Logger.setEnabled, undefined, "Ext.Logger.setEnabled should be defined");
});

test("FixMyStreet.controller", function() {
	notStrictEqual(FixMyStreet.controller.List, undefined, "FixMyStreet.controller.List should be defined");
	notStrictEqual(FixMyStreet.controller.Map, undefined, "FixMyStreet.controller.Map should be defined");
	notStrictEqual(FixMyStreet.controller.ProblemMap, undefined, "FixMyStreet.controller.ProblemMap should be defined");
	notStrictEqual(FixMyStreet.controller.ReportMap, undefined, "FixMyStreet.controller.ReportMap should be defined");
});

test("FixMyStreet.model", function() {
	notStrictEqual(FixMyStreet.model.Problem, undefined, "FixMyStreet.model.Problem should be defined");
	notStrictEqual(FixMyStreet.model.Status, undefined, "FixMyStreet.model.Status should be defined");
	notStrictEqual(FixMyStreet.model.Type, undefined, "FixMyStreet.model.Type should be defined");
	notStrictEqual(FixMyStreet.model.UserId, undefined, "FixMyStreet.model.UserId should be defined");
});

test("FixMyStreet.plugin", function() {
	notStrictEqual(FixMyStreet.plugin.PullRefresh, undefined, "FixMyStreet.plugin.PullRefresh should be defined");
});

test("FixMyStreet.proxy", function() {
	notStrictEqual(FixMyStreet.proxy.FusionTables, undefined, "FixMyStreet.proxy.FusionTables should be defined");
});

test("FixMyStreet.store", function() {
	notStrictEqual(FixMyStreet.store.Problems, undefined, "FixMyStreet.store.Problems should be defined");
	notStrictEqual(FixMyStreet.store.Status, undefined, "FixMyStreet.store.Status should be defined");
	notStrictEqual(FixMyStreet.store.Types, undefined, "FixMyStreet.store.Types should be defined");
	notStrictEqual(FixMyStreet.store.UserId, undefined, "FixMyStreet.store.UserId should be defined");
});

test("FixMyStreet.util", function() {
	notStrictEqual(FixMyStreet.util.Config, undefined, "FixMyStreet.util.Config should be defined");
	notStrictEqual(FixMyStreet.util.Geolocation, undefined, "FixMyStreet.util.Geolocation should be defined");
});

test("FixMyStreet.view", function() {
	notStrictEqual(FixMyStreet.view.MainContainer, undefined, "FixMyStreet.view.MainContainer should be defined");
	notStrictEqual(FixMyStreet.view.MapNoCenter, undefined, "FixMyStreet.view.MapNoCenter should be defined");
	
	notStrictEqual(FixMyStreet.view.list.ListContainer, undefined, "FixMyStreet.view.list.ListContainer should be defined");
	notStrictEqual(FixMyStreet.view.list.ProblemActionSheet, undefined, "FixMyStreet.view.list.ProblemActionSheet should be defined");
	notStrictEqual(FixMyStreet.view.list.ProblemList, undefined, "FixMyStreet.view.list.ProblemList should be defined");
	
	notStrictEqual(FixMyStreet.view.map.SettingsPopupPanel, undefined, "FixMyStreet.view.map.SettingsPopupPanel should be defined");
	notStrictEqual(FixMyStreet.view.map.MapContainer, undefined, "FixMyStreet.view.map.MapContainer should be defined");
	
	notStrictEqual(FixMyStreet.view.report.InfoPopupPanel, undefined, "FixMyStreet.view.report.InfoPopupPanel should be defined");
	notStrictEqual(FixMyStreet.view.report.ProblemAddedPopupPanel, undefined, "FixMyStreet.view.report.ProblemAddedPopupPanel should be defined");
	notStrictEqual(FixMyStreet.view.report.ReportContainer, undefined, "FixMyStreet.view.report.ReportContainer should be defined");
});