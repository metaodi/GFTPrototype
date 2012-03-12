module("GftLib", {
    setup: function() {
		this.gft = new GftLib();
		this.testGftTableId = 3119397;
	},
	teardown: function(){}
});

test("Construtor", function() {
	ok(this.gft instanceof GftLib, 'Object should be of GftLib or one of it\'s childs');
});

test("Constants", function() {
	equal(this.gft.GFT_URL,'http://www.google.com/fusiontables/api/query?');
	equal(this.gft.jsonUrlTail, '&jsonCallback=?');
});

asyncTest("doGet", 1, function() {
	var testCb = function(data, status) {
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.doGet('index.html', '', testCb);
});

asyncTest("doPost", 1, function() {
	var testCb = function(data, status) {
		equal(status, "success", "Status 'success' expected");
		start();  
	}
	this.gft.doPost('index.html', '', testCb);//
});

asyncTest("doGetJSONP", 1, function() {
	var testCb = function(data, status) {
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.doGetJSONP('http://api.twitter.com/trends/1.json', '', testCb);
});

asyncTest("doPostJSONP", 1, function() {
	var testCb = function(data, status) {
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.doPostJSONP('http://api.twitter.com/trends/1.json', '', testCb);
});

asyncTest("Exec SQL", 7, function() {
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
	this.gft.execSql(testCb, 'select * from ' + this.testGftTableId + ' limit 1');
});

asyncTest("ConvertToObject for single object", 4, function() {
	var gft = this.gft;
	var testCb = function(data,status) {
		var gftObjs = gft.convertToObject(data);
		equal(gftObjs[0].text, 'Some record');
		equal(gftObjs[0].number, 3);
		equal(gftObjs[0].location, 'Zurich');
		equal(gftObjs[0].date, '03.03.2012');
		start();
	}
	this.gft.execSql(testCb, 'select * from ' + this.testGftTableId + ' limit 1');
});

asyncTest("ConvertToObject for multiple objects", 4, function() {
	var gft = this.gft;
	var testCb = function(data,status) {
		var gftObjs = gft.convertToObject(data);
		equal(gftObjs[0].text, 'Some record');
		equal(gftObjs[1].text, 'Another record');
		equal(gftObjs[2].text, 'And another record');
		equal(gftObjs[3].text, 'Yet another record');
		start();
	}
	this.gft.execSql(testCb, 'select * from ' + this.testGftTableId + ' limit 4');
});

asyncTest("ExecSelect", 8, function() {
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
	this.gft.execSelect(testCb, "*", this.testGftTableId, "Text = 'Some record'");
});

asyncTest("ExecSelect: Projection", 6, function() {
	var testCb = function(data,status) {
		equal(data.table.rows.length,1);
		equal(data.table.rows[0].length,1);
		equal(data.table.cols.length,1);
		equal(data.table.cols[0],"Text");
		equal(data.table.rows[0][0],"Some record");
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.execSelect(testCb, "Text", this.testGftTableId, null, null, null, 1);
});

asyncTest("ExecSelect: Order by", 3, function() {
	var testCb = function(data,status) {
		equal(data.table.rows[0][0],"Yet another record");
		equal(data.table.rows[1][0],"Some record");
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.execSelect(testCb, "Text", this.testGftTableId, null, "Text desc", null, 2);
});
