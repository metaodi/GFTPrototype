module("GftLib", {
    setup: function() {
		this.gft = new GftLib();
		this.publicMethods = [
			'execSql',
			'execSelect',
			'execInsert',
			'execUpdate',
			'execDelete',
			'getTableDescription',
			'createView',
			'convertToObject',
			'__sendRequest',
			'__readRequest',
			'__writeRequest',
			'__auth',
			'__getAccessToken',
			'__scopedDataCallback'
		];
		this.privateMethods = [
			'sendRequest',
			'readRequest',
			'writeRequest',
			'auth',
			'getAccessToken',
			'scopedDataCallback',
		];
		this.constants = [
			'GFT_PATH',
			'ACCESS_TOKEN_URL',
			'clientId',
			'apiKey',
			'scope',
			'accessToken'
		];
		this.testGftTable = '1R9FMod3LN7UO3R6jp7gJeSQ9hbEVOwLqF0AZFQg';
		this.testGftInsertTable = '1uMyelq7qaA9htJLYIcEdD9jyV3MYjB_PrMUiwmE';
	},
	teardown: function(){}
});

test("Construtor", function() {
	ok(this.gft instanceof GftLib, 'Object should be of GftLib or one of it\'s childs');
});

test("Public API", function() {
	var publicApi = this.publicMethods.concat(this.constants);
	for (var prop in this.gft) {
		ok(publicApi.indexOf(prop) > -1, 'Public property ' + prop + ' is in API');
	}
});

test("Public Methods", function() {
	for (var i in this.publicMethods) {
		var fn = this.publicMethods[i];
		ok(this.gft.hasOwnProperty(fn), 'Public function ' + fn + ' should exist');
		strictEqual(typeof this.gft[fn], 'function', 'Public function ' + fn + ' should be a function');
	}
});

test("Private Methods", function() {
	for (var i in this.privateMethods) {
		var fn = this.privateMethods[i];
		var ut_fn = '__' + fn;
		ok(!this.gft.hasOwnProperty(fn), 'Private function ' + fn + ' should not be accessible');
		strictEqual(typeof this.gft[ut_fn], 'function', 'Unit test alias ' + ut_fn + ' should exist');
	}
});

test("Constants", function() {
	for (var i in this.constants) {
		var constant = this.constants[i];
		ok(this.gft.hasOwnProperty(constant), 'Constant ' + constant + ' should exist');
	}
	
	strictEqual(this.gft.GFT_PATH,'/fusiontables/v1/query');
	strictEqual(this.gft.ACCESS_TOKEN_URL,'http://gft.rdmr.ch/services/OAuthToken.php?jsonp=?');
	strictEqual(this.gft.clientId, '63601791805.apps.googleusercontent.com');
    strictEqual(this.gft.apiKey, 'AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME');
    strictEqual(this.gft.scope, 'https://www.googleapis.com/auth/fusiontables');
	strictEqual(this.gft.accessToken, null);
});

asyncTest("scopedDataCallback w/o scope", 3, function() {
	var gft = this.gft;
	var myObj = {test: 'test'};
	var testCb = function(data,status) {
		deepEqual(this,gft,'Without a scope `this` referts to the GftLib');
		equal(this.test,undefined,'Callback return value should be undefined (wrong scope)');
		start();
	}
	var newFn = this.gft.__scopedDataCallback(testCb);
	equals(typeof newFn, 'function', 'Return value should be a function');
	newFn();
});

asyncTest("scopedDataCallback with scope", 3, function() {
	var myObj = {test: 'test'};
	var testCb = function(data,status) {
		deepEqual(this,myObj,'`this` should be the given myObj');
		equal(this.test,'test','Callback return value should match input');
		start();
	}
	var newFn = this.gft.__scopedDataCallback(testCb,myObj);
	equals(typeof newFn, 'function', 'Return value should be a function');
	newFn();
});

asyncTest("sendRequest", 6, function() {
	var testCb = function(resp) {
		ok(resp.hasOwnProperty('kind'), "Response should have 'kind' property");
		ok(resp.hasOwnProperty('columns'), "Response should have 'columns' property");
		ok(resp.hasOwnProperty('rows'), "Response should have 'rows' property");
		
		equal(resp.kind, 'fusiontables#sqlresponse', 'Response should be a sql response');
		equal(resp.rows.length,1, 'There should be exactly one result row');
		ok(resp.columns.length >= 1, 'There should be at least one column');
		
		start();
	}
	var params = {
		path: this.gft.GFT_PATH,
		params: { 
			sql: "select * from " + this.testGftTable + " limit 1"
		}
	};
	this.gft.__sendRequest(params,testCb);
});

asyncTest("readRequest", 7, function() {
	var testCb = function(data,status) {
		if (data === null) {
			ok(false, "readRequest failed with status: " + status);
			start();
			return;
		}
		equal(data.columns[0],"Text");
		equal(data.columns[1],"Number");
		equal(data.columns[2],"Location");
		equal(data.columns[3],"Date");
		equal(data.rows[0][0],"Some record");
		equal(data.rows[0][2],"Zurich");
		
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	this.gft.__readRequest(testCb,'select * from ' + this.testGftTable + ' limit 1');
});

asyncTest("writeRequest", 5, function() {
	var testCb = function(data,status) {
		if (data === null) {
			ok(false, "writeRequest failed with status: " + status);
			start();
			return;
		}
		equal(data.rows.length,1);
		equal(data.columns.length,1);
		equal(data.columns[0],"rowid");
		ok($.isNumeric(data.rows[0][0]));
		
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	this.gft.__writeRequest(testCb,'insert into  ' + this.testGftInsertTable + ' (Text) values (\'Test\')');
});

asyncTest("auth", 4, function() {
	var gft = this.gft;
	var testCb = function(success) {
		equal(success,true,'Successful authentication excepected');
		notStrictEqual(gft.accessToken,null,'After calling auth() the accessToken (' + gft.accessToken + ') should be set');
		strictEqual(gft.accessToken,gapi.auth.getToken().access_token,'accessToken should be set on gapi.auth');
		start();
	}
	strictEqual(gft.accessToken,null,'Before calling auth() the accessToken should be null');
	gft.__auth(testCb);
});

asyncTest("getAccessToken w/o accessToken", 8, function() {
	var gft = this.gft;
	var testCb = function(data,status) {
		strictEqual(status,'success','Successful retrieval of accessTOken excepected');
		if (data === null) {
			ok(false, "getAccessToken failed with status: " + status);
			start();
			return;
		}
		ok(data.hasOwnProperty('access_token'), "Data should have 'access_token' property");
		ok(data.hasOwnProperty('expires_in'), "Data should have 'expires_in' property");
		ok(data.hasOwnProperty('created'), "Data should have 'created' property");
		
		notStrictEqual(data.access_token,null,'accessToken should be in data');
		notStrictEqual(gft.accessToken,null,'After calling getAccessToken() the accessToken (' + gft.accessToken + ') should be set');
		strictEqual(data.access_token,gft.accessToken,'Retrieved and set value should be the same');
		start();
	}
	strictEqual(gft.accessToken,null,'Before calling getAccessToken() the accessToken should be null');
	gft.__getAccessToken(testCb);
});

asyncTest("getAccessToken with accessToken", 6, function() {
	var gft = this.gft;
	var testAccessToken = 'testAccessToken';
	gft.accessToken = testAccessToken;
	var testCb = function(data,status) {
		strictEqual(status,undefined,'There should be not status if accessToken is provided');
		
		equal(data.hasOwnProperty('access_token'), false, "Data should not have 'access_token' property");
		equal(data.hasOwnProperty('expires_in'), false, "Data should not have 'expires_in' property");
		equal(data.hasOwnProperty('created'), false, "Data should not have 'created' property");
		
		notStrictEqual(gft.accessToken,null,'After calling getAccessToken() the accessToken (' + gft.accessToken + ') should be set');
		strictEqual(gft.accessToken,testAccessToken,'Retrieved and set value should be the same');
		start();
	}
	gft.__getAccessToken(testCb);
});

asyncTest("execSql", 7, function() {
	var testCb = function(data,status) {
		equal(data.columns[0],"Text");
		equal(data.columns[1],"Number");
		equal(data.columns[2],"Location");
		equal(data.columns[3],"Date");
		equal(data.rows[0][0],"Some record");
		equal(data.rows[0][2],"Zurich");
		
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	this.gft.execSql(testCb, 'select * from ' + this.testGftTable + ' limit 1');
});

asyncTest("convertToObject for single object", 4, function() {
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

asyncTest("convertToObject for multiple objects", 4, function() {
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

asyncTest("execSelect: Condition", 8, function() {
	var testCb = function(data,status) {
		equal(data.rows.length,1);
		equal(data.columns[0],"Text");
		equal(data.columns[1],"Number");
		equal(data.columns[2],"Location");
		equal(data.columns[3],"Date");
		equal(data.rows[0][0],"Some record");
		equal(data.rows[0][2],"Zurich");
		
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, condition:"Text = 'Some record'"});
});

asyncTest("execSelect: Projection", 6, function() {
	var testCb = function(data,status) {
		equal(data.rows.length,1);
		equal(data.rows[0].length,1);
		equal(data.columns.length,1);
		equal(data.columns[0],"mytext");
		equal(data.rows[0][0],"Some record");
		
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, fields:"Text as mytext",  limit:1});
});

asyncTest("execSelect: Projection (fields)", 8, function() {
	var testCb = function(data,status) {
		equal(data.rows.length,1, '1 result row expected');
		equal(data.rows[0].length,2, '2 result columns in row expected');
		equal(data.columns.length,2, '2 columns expected');
		equal(data.columns[0],"mytext", '1st column is `mytext`');
		equal(data.columns[1],"Number", '2nd column is `Number`');
		equal(data.rows[0][0],"Some record", 'Value of mytext is `Some record`');
		equal(data.rows[0][1],'3','Value of Number is 3');
		
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, fields:['Text as mytext','Number'],  limit:1});
});

asyncTest("execSelect: Order by", 3, function() {
	var testCb = function(data,status) {
		equal(data.rows[0][0],"Yet another record");
		equal(data.rows[1][0],"Some record");
		
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, fields:"Text", orderby:"Text desc", limit:2});
});

asyncTest("execSelect: Group by", 4, function() {
	var testCb = function(data,status) {
		equal(data.rows.length,1);
		equal(data.rows[0][0],2);
		equal(data.rows[0][1],3);
		
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	this.gft.execSelect(testCb, {table:this.testGftTable, fields:"count(),Number", condition:"Number = 3", groupby:"Number"});
});

asyncTest("execInsert (string)", 5, function() {
	var gft = this.gft;
	
	var testCb = function(data,status) {
		if (data === null) {
			ok(false, "writeRequest failed with status: " + status);
			start();
			return;
		}
		
		equal(data.columns.length,1);
		equal(data.columns[0],'rowid');
		equal(data.rows.length,1);
		ok($.isNumeric(data.rows[0][0]));

		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	
	gft.execInsert(testCb, {table:this.testGftInsertTable, fields:"Text,Number,Location,Date", values:"Insert by Unit-Test,33,,"+getDateString()});
});

asyncTest("execInsert (fields)", 5, function() {
	var gft = this.gft;
	
	var testCb = function(data,status) {
		if (data === null) {
			ok(false, "writeRequest failed with status: " + status);
			start();
			return;
		}
		
		equal(data.columns.length,1);
		equal(data.columns[0],'rowid');
		equal(data.rows.length,1);
		ok($.isNumeric(data.rows[0][0]));

		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		start();
	}
	
	gft.execInsert(testCb, {table:this.testGftInsertTable, fields:['Text','Number','Location','Date'], values:['Insert by Unit-Test',33,'',getDateString()]});
});

asyncTest("execUpdate (string)", 4, function() {
	var gft = this.gft;
	var tableId = this.testGftInsertTable;
	var rowId = null;
	var newValue = 'brand new value';
	
	var testCb = function(data,status) {
		if (data === null) {
			ok(false, "select for execUpdate failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		data = gft.convertToObject(data)[0];
		equal(data.text,newValue,'Value should be updated');
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "insert for execUpdate failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		gft.execSelect(testCb, {table:tableId, condition:"rowid = '"+ rowId +"'"});
	}
	
	var updateCb = function(data,status) {
		if (data === null) {
			ok(false, "insert for execUpdate failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execUpdate(selectCb, {table:tableId, fields:["Text"], values: [newValue], condition:"rowid = '" + rowId + "'"});
	}
	gft.execInsert(updateCb, {table:tableId, fields:'Text,Number,Location,Date', values:"Insert by Unit-Test for UPDATE,44,'',"+getDateString()});
});

asyncTest("execUpdate (fields)", 4, function() {
	var gft = this.gft;
	var tableId = this.testGftInsertTable;
	var rowId = null;
	var newValue = 'brand new value';
	
	var testCb = function(data,status) {
		if (data === null) {
			ok(false, "select for execUpdate failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		data = gft.convertToObject(data)[0];
		equal(data.text,newValue,'Value should be updated');
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "insert for execUpdate failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		gft.execSelect(testCb, {table:tableId, condition:"rowid = '"+ rowId +"'"});
	}
	
	var updateCb = function(data,status) {
		if (data === null) {
			ok(false, "insert for execUpdate failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execUpdate(selectCb, {table:tableId, fields:["Text"], values: [newValue], condition:"rowid = '" + rowId + "'"});
	}
	gft.execInsert(updateCb, {table:tableId, fields:['Text','Number','Location','Date'], values:['Insert by Unit-Test for UPDATE',44,'',getDateString()]});
});

asyncTest("execDelete (string)", 4, function() {
	var gft = this.gft;
	var tableId = this.testGftInsertTable;
	var rowId = null;
	
	var testCb = function(data,status) {
		if (data === null) {
			ok(false, "select for execDelete failed with status: " + status);
			start();
			return;
		}
		equal(data.rows,undefined,'Record should not exist after DELETE');
		equal(data.columns.length,4,'Only columns shoudl exist');
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "delete for execDelete failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		gft.execSelect(testCb, {table:tableId, condition:"rowid = '"+ rowId +"'"});
	}
	
	var deleteCb = function(data,status) {
		if (data === null) {
			ok(false, "insert for execDelete failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execDelete(selectCb, {table:tableId, condition:"rowid = '" + rowId + "'"});
	}

	gft.execInsert(deleteCb, {table:tableId, fields:"Text,Number,Location,Date", values:"Insert by Unit-Test for DELETE,55,,"+getDateString()});
});

asyncTest("execDelete (fields)", 4, function() {
	var gft = this.gft;
	var tableId = this.testGftInsertTable;
	var rowId = null;
	
	var testCb = function(data,status) {
		if (data === null) {
			ok(false, "select for execDelete failed with status: " + status);
			start();
			return;
		}
		equal(data.rows,undefined,'Record should not exist after DELETE');
		equal(data.columns.length,4,'Only columns shoudl exist');
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "delete for execDelete failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		gft.execSelect(testCb, {table:tableId, condition:"rowid = '"+ rowId +"'"});
	}
	
	var deleteCb = function(data,status) {
		if (data === null) {
			ok(false, "insert for execDelete failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execDelete(selectCb, {table:tableId, condition:"rowid = '" + rowId + "'"});
	}

	gft.execInsert(deleteCb, {table:tableId, fields:['Text','Number','Location','Date'], values:['Insert by Unit-Test for DELETE',55,'',getDateString()]});
});

asyncTest("getTableDescription", 9, function() {
	var gft = this.gft;
	
	var testCb = function(data,status) {
		data = gft.convertToObject(data);
		equal(data.length,4,'4 columns expected');
		equal(data[0].name,'Text','1st column is Text');
		equal(data[0].type,'string','Text is a string');
		
		equal(data[1].name,'Number','2nd column is Number');
		equal(data[1].type,'number','Number is a number');
		
		equal(data[2].name,'Location','3rd column is Location');
		equal(data[2].type,'location','Location column is of location type');
		
		equal(data[3].name,'Date','4th column is Date');
		equal(data[3].type,'datetime','Date is of type datetime');
		start();
	}
	
	gft.getTableDescription(testCb, {table:this.testGftInsertTable});
});

asyncTest("createView", 3, function() {
	var gft = this.gft;
	
	var testCb = function(data,status) {
		data = gft.convertToObject(data);
		equal(data.length,1,'1 row expected');
		
		var resp = data[0];
		notStrictEqual(resp.tableid,undefined,'Table-ID of new view should not be empty: ' + resp.tableid);
		notStrictEqual(resp.tableid,null,'Table-ID of new view should not be empty: ' + resp.tableid);
		start();
	}
	
	gft.createView(testCb, {viewName:'test_view', query:"select Text from " + this.testGftInsertTable + " where Number = 33"});
});

asyncTest("SELECT after INSERT with ST_INTERSECTS (one column adress)", 4, function() {
	var gft = this.gft;
	var tableId = '10k6S5HN2iF1tWCIytST3Nhq7e5s-Hyakma_IlXE';
	var rowId = null;
	
	
	var locStr = 'Rathausstrasse 8, 8640 Rapperswil-Jona, Switzerland';
	var lat = 47.22645443980465;
	var lng = 8.81760273809823;
	var lowerLeftCorner  = 'LATLNG(' + (lat - 0.1) + ',' + (lng - 0.1) + ')';
	var upperRightCorner = 'LATLNG(' + (lat + 0.1) + ',' + (lng + 0.1) + ')';
	
	var testCb = function(data,status) {
		if (data === null || data.error !== undefined) {
			ok(false, "select failed with status: " + status);
			console.log(status);
			console.log(data);
			start();
			return;
		}
		notStrictEqual(data.rows,undefined,'There should be results');
		if (data.rows !== undefined) {
			equal(data.rows.length,1,'There should be exaxtly one record');
			equal(data.rows[0][0],rowId,'The returned row should equal the previous inserted row.');
		}
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "insert failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execSelect(testCb, {table:tableId, conditions:["rowid = '" + rowId + "'", "ST_INTERSECTS(Location, RECTANGLE(" + lowerLeftCorner + ", " + upperRightCorner + "))"]});
	}
	
	gft.execInsert(selectCb, {table:tableId, fields:['Text','Number','Location','Date'], values:['Insert by Unit-Test for ST_INTERSECTS (one column adress)', 90, locStr, getDateString()]});
});

asyncTest("SELECT after INSERT with ST_INTERSECTS (one column lat/lng and space)", 4, function() {
	var gft = this.gft;
	var tableId = '10k6S5HN2iF1tWCIytST3Nhq7e5s-Hyakma_IlXE';
	var rowId = null;
	
	var lat = 47.22398443540521;
	var lng = 8.813815458969202;
	var locStr = lat + ' ' + lng;
	var lowerLeftCorner  = 'LATLNG(' + (lat - 0.1) + ',' + (lng - 0.1) + ')';
	var upperRightCorner = 'LATLNG(' + (lat + 0.1) + ',' + (lng + 0.1) + ')';
	
	var testCb = function(data,status) {
		if (data === null || data.error !== undefined) {
			ok(false, "select failed with status: " + status);
			console.log(status);
			console.log(data);
			start();
			return;
		}
		notStrictEqual(data.rows,undefined,'There should be results');
		if (data.rows !== undefined) {
			equal(data.rows.length,1,'There should be exaxtly one record');
			equal(data.rows[0][0],rowId,'The returned row should equal the previous inserted row.');
		}
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "insert failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execSelect(testCb, {fields:['rowid','Text','Number','Location','Date'], table:tableId, conditions:["rowid = '" + rowId + "'", "ST_INTERSECTS(Location, RECTANGLE(" + lowerLeftCorner + ", " + upperRightCorner + "))"]});
	}
	
	gft.execInsert(selectCb, {table:tableId, fields:['Text','Number','Location','Date'], values:['Insert by Unit-Test for ST_INTERSECTS (one column lat/lng and space)', 91, locStr, getDateString()]});
});

asyncTest("SELECT after INSERT with ST_INTERSECTS (one column lat/lng and comma)", 4, function() {
	var gft = this.gft;
	var tableId = '10k6S5HN2iF1tWCIytST3Nhq7e5s-Hyakma_IlXE';
	var rowId = null;
	
	var lat = 47.22398443540521;
	var lng = 8.813815458969202;
	var locStr = lat + ',' + lng;
	var lowerLeftCorner  = 'LATLNG(' + (lat - 0.1) + ',' + (lng - 0.1) + ')';
	var upperRightCorner = 'LATLNG(' + (lat + 0.1) + ',' + (lng + 0.1) + ')';
	
	var testCb = function(data,status) {
		if (data === null || data.error !== undefined) {
			ok(false, "select failed with status: " + status);
			console.log(status);
			console.log(data);
			start();
			return;
		}
		notStrictEqual(data.rows,undefined,'There should be results');
		if (data.rows !== undefined) {
			equal(data.rows.length,1,'There should be exaxtly one record');
			equal(data.rows[0][0],rowId,'The returned row should equal the previous inserted row.');
		}
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "insert failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execSelect(testCb, {fields:['rowid','Text','Number','Location','Date'], table:tableId, conditions:["rowid = '" + rowId + "'", "ST_INTERSECTS(Location, RECTANGLE(" + lowerLeftCorner + ", " + upperRightCorner + "))"]});
	}
	
	gft.execInsert(selectCb, {table:tableId, fields:['Text','Number','Location','Date'], values:['Insert by Unit-Test for ST_INTERSECTS (one column lat/lng and comma)', 92, locStr, getDateString()]});
});

asyncTest("SELECT after INSERT with ST_INTERSECTS (one column KML)", 4, function() {
	var gft = this.gft;
	var tableId = '10k6S5HN2iF1tWCIytST3Nhq7e5s-Hyakma_IlXE';
	var rowId = null;
	
	var lat = 47.22398443540521;
	var lng = 8.813815458969202;
	var locStr = "<Point><coordinates>"+lng+"," + lat + "</coordinates></Point>";
	var lowerLeftCorner  = 'LATLNG(' + (lat - 0.1) + ',' + (lng - 0.1) + ')';
	var upperRightCorner = 'LATLNG(' + (lat + 0.1) + ',' + (lng + 0.1) + ')';
	
	var testCb = function(data,status) {
		if (data === null || data.error !== undefined) {
			ok(false, "select failed with status: " + status);
			console.log(status);
			console.log(data);
			start();
			return;
		}
		notStrictEqual(data.rows,undefined,'There should be results');
		if (data.rows !== undefined) {
			equal(data.rows.length,1,'There should be exaxtly one record');
			equal(data.rows[0][0],rowId,'The returned row should equal the previous inserted row.');
		}
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "insert failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execSelect(testCb, {fields:['rowid','Text','Number','Location','Date'], table:tableId, conditions:["rowid = '" + rowId + "'", "ST_INTERSECTS(Location, RECTANGLE(" + lowerLeftCorner + ", " + upperRightCorner + "))"]});
	}
	
	gft.execInsert(selectCb, {table:tableId, fields:['Text','Number','Location','Date'], values:['Insert by Unit-Test for ST_INTERSECTS (one column KML)', 93, locStr, getDateString()]});
});

asyncTest("SELECT after INSERT with ST_INTERSECTS (two column lat/lng)", 4, function() {
	var gft = this.gft;
	var tableId = '1Ur-OvnHt5i3b0lgldsqv4Y63clPI3JxHe4e27b4';
	var rowId = null;
	
	var lat = 47.22398443540521;
	var lng = 8.813815458969202;
	var lowerLeftCorner  = 'LATLNG(' + (lat - 0.1) + ',' + (lng - 0.1) + ')';
	var upperRightCorner = 'LATLNG(' + (lat + 0.1) + ',' + (lng + 0.1) + ')';
	
	var testCb = function(data,status) {
		if (data === null || data.error !== undefined) {
			ok(false, "select failed with status: " + status);
			console.log(status);
			console.log(data);
			start();
			return;
		}
		notStrictEqual(data.rows,undefined,'There should be results');
		if (data.rows !== undefined) {
			equal(data.rows.length,1,'There should be exaxtly one record');
			equal(data.rows[0][0],rowId,'The returned row should equal the previous inserted row.');
		}
		start();
	}
	
	var selectCb = function(data,status) {
		if (data === null) {
			ok(false, "insert failed with status: " + status);
			start();
			return;
		}
		var statusObj = JSON.parse(status);
		equal(statusObj.gapiRequest.data.statusText, "OK", "Status 'OK' expected");
		
		rowId = data.rows[0][0];
		gft.execSelect(testCb, {fields:['rowid','Text','Number','latitude','longitude','Date'], table:tableId, conditions:["rowid = '" + rowId + "'", "ST_INTERSECTS(latitude, RECTANGLE(" + lowerLeftCorner + ", " + upperRightCorner + "))"]});
	}
	
	gft.execInsert(selectCb, {table:tableId, fields:['Text','Number','latitude','longitude','Date'], values:['Insert by Unit-Test for ST_INTERSECTS (two column lat/lng)', 94, lat, lng, getDateString()]});
});