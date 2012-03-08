module("GftLib");
var testGftTableId = 3119397;

test("Construtor", function() {
	var gft = new GftLib();
	ok(gft instanceof GftLib, 'Object should be of GftLib or one of it\'s childs');
});

test("Constants", function() {
	var gft = new GftLib();
	equal(gft.GFT_URL,'http://www.google.com/fusiontables/api/query?');
	equal(gft.jsonUrlTail, '&jsonCallback=?');
});

asyncTest("doGet", 1, function() {
	var gft = new GftLib();
	var testCb = function(data, status) {
		equal(status, "success", "Status 'success' expected");
		start();
	}
	gft.doGet('index.html', '', testCb);
});

asyncTest("doPost", 1, function() {
	var gft = new GftLib();

	var testCb = function(data, status) {
		equal(status, "success", "Status 'success' expected");
		start();  
	}
	gft.doPost('index.html', '', testCb);//
});

asyncTest("doGetJSONP", 1, function() {
	var gft = new GftLib();

	var testCb = function(data, status) {
		equal(status, "success", "Status 'success' expected");
		start();
	}
	gft.doGetJSONP('http://api.twitter.com/trends/1.json', '', testCb);
});

asyncTest("doPostJSONP", 1, function() {
	var gft = new GftLib();
	
	var testCb = function(data, status) {
		equal(status, "success", "Status 'success' expected");
		start();
	}
	gft.doPostJSONP('http://api.twitter.com/trends/1.json', '', testCb);
});

asyncTest("Exec SQL", 7, function() {
	var gft = new GftLib;
	var testCb = function(data,status) {
		equal(data.table.cols[0],"Text");
		equal(data.table.cols[1],"Number");
		equal(data.table.cols[2],"Location");
		equal(data.table.cols[3],"Date");
		equal(data.table.rows[0][0],"Some record");
		equal(data.table.rows[0][2],"Zurich");
		equal(status, 'success', "Status 'success' expected");
		start();
	}
	gft.execSql("select * from " + testGftTableId + " limit 1", testCb);
});

asyncTest("ConvertToObject for single object", 4, function() {
	var gft = new GftLib;
	var testCb = function(data,status) {
		var gftObjs = gft.convertToObject(data);
		equal(gftObjs[0].text, 'Some record');
		equal(gftObjs[0].number, 3);
		equal(gftObjs[0].location, 'Zurich');
		equal(gftObjs[0].date, '03.03.2012');
		start();
	}
	gft.execSql('select * from ' + testGftTableId + ' limit 1',testCb);
});

asyncTest("ConvertToObject for multiple objects", 4, function() {
	var gft = new GftLib;
	var testCb = function(data,status) {
		var gftObjs = gft.convertToObject(data);
		equal(gftObjs[0].text, 'Some record');
		equal(gftObjs[1].text, 'Another record');
		equal(gftObjs[2].text, 'And another record');
		equal(gftObjs[3].text, 'Yet another record');
		start();
	}
	gft.execSql('select * from ' + testGftTableId + ' limit 4',testCb);
});



asyncTest("ExecSelect", 8, function() {
	var gft = new GftLib;
	var testCb = function(data,status) {
		equal(data.table.rows.length,1);
		equal(data.table.cols[0],"Text");
		equal(data.table.cols[1],"Number");
		equal(data.table.cols[2],"Location");
		equal(data.table.cols[3],"Date");
		equal(data.table.rows[0][0],"Some record");
		equal(data.table.rows[0][2],"Zurich");
		equal(status, "success", "Status 'success' expected");
		start();
	}
	gft.execSelect(testCb, "*", testGftTableId, "Text = 'Some record'");
});
