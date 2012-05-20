module("WorldData-Config");

test("Config initialized", 1, function() {
	ok($.fusiontable !== null, "$.fusiontable should be initialized");
});

test("Config values", 1, function() {
	equals($.fusiontable.id, '1Ex_gdGfRST85LTD9JxCwhohXFtRKo0_ap9G6cEI');
});

