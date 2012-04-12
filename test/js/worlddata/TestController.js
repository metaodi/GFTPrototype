module("WorldDataController", {
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

test("getDifferencePercentage() - integers", function() {
	equal(this.controller.__getDifferencePercentage(1,1), '0%');
	equal(this.controller.__getDifferencePercentage(2,1), '+100%');
	equal(this.controller.__getDifferencePercentage(1,2), '-50%');
	equal(this.controller.__getDifferencePercentage(0,1), '-100%');
	try {
		equal(this.controller.__getDifferencePercentage(1,0), '-100%');
		ok(false, 'Should not reach this line, because 0 is not an allowed value');
	} catch(e) {
		console.log(e);
		equal(e.message,'Value to compare may not be zero.');
	}
	
});

test("getDifferencePercentage() - floats", function() {
	equal(this.controller.__getDifferencePercentage(2.2525,2.2525), '0%');
	equal(this.controller.__getDifferencePercentage(1.25,1), '+25%');
	equal(this.controller.__getDifferencePercentage(1,1.25), '-20%');
	equal(this.controller.__getDifferencePercentage(0.125,0.126), '-0.79%');
});

test("getDifferencePercentage() - negative", function() {
	equal(this.controller.__getDifferencePercentage(-1,1), '-200%');
	equal(this.controller.__getDifferencePercentage(1,-1), '+5%');
	equal(this.controller.__getDifferencePercentage(-1,-2), '+100%');
	equal(this.controller.__getDifferencePercentage(0.125,0.126), '-0.79%');
});