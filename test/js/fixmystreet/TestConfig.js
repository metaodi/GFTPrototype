module("FixMyStreet-Config");

test("Config initialized", function() {
	ok(FixMyStreet.util.Config !== null, "FixMyStreet.util.Config should be initialized");
	ok(FixMyStreet.util.Config.getFusionTable() !== null, "FixMyStreet.util.Config.getFusionTable() should be initialized");
});

test("Config values", function() {
	var config = FixMyStreet.util.Config;
	equals(config.getPollingFrequency(), 30000, 'pollingFrequency should be set to 30s');
	notEqual(config.getUserId(), 0, 'UserId is a generated UUID, it should never be null');
	ok(config.getUserId() !== null, 'UserId is a generated UUID, it should never be null');
});

test("GFT config values", function() {
	var gftConfig = FixMyStreet.util.Config.getFusionTable();
	equals(gftConfig.idField, 'rowid');
	equals(gftConfig.writeTableId, '1E-hyhqyj9CCBj53F3Pb8jExUqoAqhZWWHFrxnNU');
	equals(gftConfig.readTableId, '1F7rJMZ0wD3MS7TXu98fqYsHG1sULL8dszHI_qzQ');
	
	var allFields = ['userid', 'timestamp', 'location', 'address', 'type', 'status'];
	ok($.isArray(gftConfig.fields), 'Fields must be an array');
	deepEqual(gftConfig.fields,allFields,'Fields should match');
	
});

test("Map config values", function() {
	var mapConfig = FixMyStreet.util.Config.getMap();
	equals(mapConfig.lat, '47.36865');
	equals(mapConfig.lng, '8.539183');
	equals(mapConfig.defaultZoom, 13);
	equals(mapConfig.reportZoom, 17);
});



