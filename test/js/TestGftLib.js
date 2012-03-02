module("GftLib");
test("Construtor", function() {
		var gft = new GftLib();
		ok(gft instanceof GftLib,'Object should be of Gft or one of it\'s childs');
});
test("Constants", function() {
		var gft = new GftLib();
		equal(gft.GFT_URL,'https://fusiontables.googleusercontent.com/fusiontables/api/query');
});
asyncTest("TestSelect", 2, function() {
		var gft = new GftLib;
		var testCb = function(response,status) {
			equal(response,"test","Expected result");
			equal(status,200,"Status OK (200) expected");
		}
		setTimeout(function() {  
			start();  
		}, 2000); 
		gft.select('show tables',testCb);
});