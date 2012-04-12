module("WorldData - Controller", {
    setup: function() {
		this.controller = new WorldDataController();
	},
	teardown: function(){}
});

test("Construtor", function() {
	ok(this.controller instanceof WorldDataController, 'Object should be of WorldDataController or one of it\'s childs');
});

test("getImageSource()", function() {
	var html = '<table><tr><td><FeatureID>1 </FeatureID></td><td><GMI_CNTRY>AFG</GMI_CNTRY></td><td><REGION>Asia</REGION></td></tr><tr><td colspan=3><a href="http://www.imageshack.us"><img src="http://img329.imageshack.us/img329/7677/afg4ke.jpg" border="0" width="300" alt="Image Hosted by ImageShack.us" /></a><br><a href="https://www.cia.gov/library/publications/the-world-factbook/geos//af.html">CIA World Factbook: AF</a></td></tr></table></td></tr></table>';
	equal(this.controller.__getImageSource(html), 'http://img329.imageshack.us/img329/7677/afg4ke.jpg');
});

test("getDifferencePercentage()", function() {
	equal(this.controller.__getDifferencePercentage(2,1), '+100%');
	equal(this.controller.__getDifferencePercentage(1,2), '-50%');
});