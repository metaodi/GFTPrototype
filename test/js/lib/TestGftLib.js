module("GftLib", {
    setup: function() {
		this.gft = new GftLib();
		this.testGftTable = '1R9FMod3LN7UO3R6jp7gJeSQ9hbEVOwLqF0AZFQg';
		this.testGftInsertTable = '1uMyelq7qaA9htJLYIcEdD9jyV3MYjB_PrMUiwmE';
	},
	teardown: function(){}
});

test("Construtor", function() {
	ok(this.gft instanceof GftLib, 'Object should be of GftLib or one of it\'s childs');
});

test("Constants", function() {
	deepEqual(this.gft.GFT_URL,'https://www.googleapis.com/fusiontables/v1/query?');
	deepEqual(this.gft.INSERT_GFT_URL,'http://'+window.location.hostname+'/gft/examples/RelayToGFT.php');
	deepEqual(this.gft.jsonUrlTail, '&callback=?');
	deepEqual(this.gft.clientId, '63601791805.apps.googleusercontent.com');
    deepEqual(this.gft.apiKey, 'AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME');
    deepEqual(this.gft.scope, 'https://www.googleapis.com/auth/fusiontables');
	deepEqual(this.gft.accessToken, null);
});

asyncTest("getUrlTail: with JSON / with token", 2, function() {
	var gft = this.gft;
	var testCb = function(authresult) {
		var token = authresult.access_token;
		equal(gft.getUrlTail(),'&access_token='+token+'&callback=?&key=AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME');
		equal(gft.getUrlTail(true),gft.getUrlTail());
		start();
	}
	this.gft.auth(testCb);
	
});

test("getUrlTail: with JSON / without token", function() {
	equal(this.gft.getUrlTail(),'&callback=?&key=AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME');
	equal(this.gft.getUrlTail(true),this.gft.getUrlTail());
});

asyncTest("getUrlTail: without JSON / with token", 1, function() {
	var gft = this.gft;
	var testCb = function(authresult) {
		var token = authresult.access_token;
		equal(gft.getUrlTail(false),'&access_token='+token+'&key=AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME');
		start();
	}
	
	this.gft.auth(testCb);
});

test("getUrlTail: without JSON and token", function() {
	equal(this.gft.getUrlTail(false),'&key=AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME');
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
		equal(data.columns[0],"Text");
		equal(data.columns[1],"Number");
		equal(data.columns[2],"Location");
		equal(data.columns[3],"Date");
		equal(data.rows[0][0],"Some record");
		equal(data.rows[0][2],"Zurich");
		equal(status, 'success', "Status 'success' expected");
		start();
	}
	this.gft.execSql(testCb, 'select * from ' + this.testGftTable + ' limit 1');
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
	this.gft.execSql(testCb, 'select * from ' + this.testGftTable + ' limit 1');
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
	this.gft.execSql(testCb, 'select * from ' + this.testGftTable + ' limit 4');
});

asyncTest("ExecSelect: Condition", 8, function() {
	var testCb = function(data,status) {
		equal(data.rows.length,1);
		equal(data.columns[0],"Text");
		equal(data.columns[1],"Number");
		equal(data.columns[2],"Location");
		equal(data.columns[3],"Date");
		equal(data.rows[0][0],"Some record");
		equal(data.rows[0][2],"Zurich");
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, condition:"Text = 'Some record'"});
});

asyncTest("ExecSelect: Projection", 6, function() {
	var testCb = function(data,status) {
		equal(data.rows.length,1);
		equal(data.rows[0].length,1);
		equal(data.columns.length,1);
		equal(data.columns[0],"mytext");
		equal(data.rows[0][0],"Some record");
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, fields:"Text as mytext",  limit:1});
});

asyncTest("ExecSelect: Order by", 3, function() {
	var testCb = function(data,status) {
		equal(data.rows[0][0],"Yet another record");
		equal(data.rows[1][0],"Some record");
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, fields:"Text", orderby:"Text desc", limit:2});
});

//TODO: This does currently not work due to a bug in the new API: http://code.google.com/p/fusion-tables/issues/detail?id=1086
asyncTest("ExecSelect: Group by", 4, function() {
	var testCb = function(data,status) {
		equal(data.rows.length,1);
		ok("uncomment the following line when bug 1086 is fixed");
		//equal(data.rows[0][0],2); -> 
		equal(data.rows[0][1],3);
		equal(status, "success", "Status 'success' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, fields:"count(),Number", condition:"Number = 3", groupby:"Number"});
});

asyncTest("ExecInsert", 5, function() {
	var gft = this.gft;
	var insertTable = this.testGftInsertTable;
	
	var testCb = function(data,status) {
		data = JSON.parse(data);
		equal(data.columns.length,1);
		equal(data.columns[0],'rowid');
		equal(data.rows.length,1);
		ok($.isNumeric(data.rows[0][0]));
		equal(status, "success", "Status 'success' expected");
		start();
	}
	
	var authCb = function(result) {
		if (result) {
			gft.execInsert(testCb, {table:insertTable, fields:"Text,Number,Location,Date", values:"'Insert by Unit-Test',33,'','2012-04-04'"});
		} else {
			ok(false, "Authentication failed!");
		}
	}
	this.gft.auth(authCb);
});