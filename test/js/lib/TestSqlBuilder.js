module("SqlBuilder", {
    setup: function() {
		this.sql = new SqlBuilder();
		this.testGftTableId = 'testtable';
		this.publicMethods = [
			'selectStmt',
			'insertStmt',
			'updateStmt',
			'deleteStmt',
			'describeStmt',
			'createViewStmt',
			'__prepareOptions',
			'__getCondition',
			'__splitToArray',
			'__checkFieldsAndValues',
			'__isString'
		];
		this.privateMethods = [
			'prepareOptions',
			'checkFieldsAndValues',
			'getCondition',
			'splitToArray',
			'isString'
		];
	},
	teardown: function(){}
});

test("Construtor", function() {
	ok(this.sql instanceof SqlBuilder, 'Object should be of SqlBuilder or one of it\'s childs');
	equal(typeof RegExp.escape,'function','RegExp.escape must be declared.');
});

test("Public API", function() {
	var publicApi = this.publicMethods;
	for (var prop in this.sql) {
		ok(publicApi.indexOf(prop) > -1, 'Public property ' + prop + ' is in API');
	}
});

test("Public Methods", function() {
	for (var i in this.publicMethods) {
		var fn = this.publicMethods[i];
		ok(this.sql.hasOwnProperty(fn), 'Public function ' + fn + ' should exist');
		strictEqual(typeof this.sql[fn], 'function', 'Public function ' + fn + ' should be a function');
	}
});

test("Private Methods", function() {
	for (var i in this.privateMethods) {
		var fn = this.privateMethods[i];
		var ut_fn = '__' + fn;
		ok(!this.sql.hasOwnProperty(fn), 'Private function ' + fn + ' should not be accessible');
		strictEqual(typeof this.sql[ut_fn], 'function', 'Unit test alias ' + ut_fn + ' should exist');
	}
});

test("SELECT (fields)", function() {
	var sql = this.sql;
	raises(function() {
		sql.selectStmt({table:this.testGftTableId, fields:"*"});
	}, "must throw error to pass");
});

test("SELECT (fields, table)", function() {
	equal(this.sql.selectStmt({fields:"Text, Number, Location", table:this.testGftTableId}), 'SELECT Text, Number, Location FROM ' + this.testGftTableId + ';');
});

test("SELECT (fields, table) array", function() {
	equal(this.sql.selectStmt({fields:['Text', 'Number', 'Location'], table:this.testGftTableId}), 'SELECT Text, Number, Location FROM ' + this.testGftTableId + ';');
});

test("SELECT (fields, table, condition)", function() {
	equal(this.sql.selectStmt({table:this.testGftTableId, condition:"Text = 'Some record'"}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("SELECT (fields, table, condition with AND)", function() {
	equal(this.sql.selectStmt({table:this.testGftTableId, condition:" AND Text = 'Some record'"}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("SELECT (fields, table, condition, orderby)", function() {
	equal(this.sql.selectStmt({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC'}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' ORDER BY text DESC;");
});

test("SELECT (fields, table, condition, orderby, groupby)", function() {
	equal(this.sql.selectStmt({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC', groupby:'Number'}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' GROUP BY Number ORDER BY text DESC;");
});

test("SELECT (fields, table, condition, orderby, groupby, limit)", function() {
	equal(this.sql.selectStmt({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC', groupby:'Number', limit:4}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' GROUP BY Number ORDER BY text DESC LIMIT 4;");
});

test("DESCRIBE table", function() {
	equal(this.sql.describeStmt({table: this.testGftTableId}), "DESCRIBE " + this.testGftTableId + ";");
});

test("INSERT", function() {
	equal(this.sql.insertStmt({table:this.testGftTableId, fields:"Text, Location, Number", values:"Some record,,123"}), "INSERT INTO " + this.testGftTableId + " ( Text, Location, Number ) VALUES ( 'Some record', '', 123 );");
});

test("INSERT (array)", function() {
	equal(this.sql.insertStmt({table:this.testGftTableId, fields:['Text', 'Number'], values:['Some record', 123]}), "INSERT INTO " + this.testGftTableId + " ( Text, Number ) VALUES ( 'Some record', 123 );");
});

test("DELETE", function() {
	var sql = this.sql;
	raises(function() {
		sql.deleteStmt({table:this.testGftTableId})
	}, "must throw error to pass");
});

test("DELETE (condition)", function() {
	equal(this.sql.deleteStmt({table:this.testGftTableId, condition:"Text = 'Some record'"}), "DELETE FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("DELETE (condition with AND)", function() {
	equal(this.sql.deleteStmt({table:this.testGftTableId, condition:"AND Text = 'Some record'"}), "DELETE FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("DELETE (multiple conditions)", function() {
	equal(this.sql.deleteStmt({table:this.testGftTableId, conditions:["Text = 'Some record'","Number = 3"]}), "DELETE FROM " + this.testGftTableId + " WHERE Text = 'Some record' AND Number = 3;");
});

test("UPDATE", function() {
	var sql = this.sql;
	raises(function() {
		sql.updateStmt({table:this.testGftTableId, fields:'Text', values:'New value'});
	}, "must throw error to pass");
});

test("UPDATE (condition)", function() {
	equal(this.sql.updateStmt({table:this.testGftTableId, fields:'Text', values:'New value', condition:"Text = 'Some record'"}), "UPDATE " + this.testGftTableId + " SET Text = 'New value' WHERE Text = 'Some record';");
});

test("UPDATE (condition + multiple fields)", function() {
	equal(this.sql.updateStmt({table:this.testGftTableId, fields:['Text', 'Number'], values:['New value', 3], condition:"Text = 'Some record'"}), "UPDATE " + this.testGftTableId + " SET Text = 'New value', Number = 3 WHERE Text = 'Some record';");
});

test("CREATE VIEW", function() {
	var sql = this.sql;
	raises(function() {
		sql.createViewStmt({viewName:'mytest'});
	}, "must throw error to pass");
});

test("CREATE VIEW (query)", function() {
	equal(this.sql.createViewStmt({viewName:'mytest', query: "select name from testtable where name = 'test'"}), "CREATE VIEW mytest AS (select name from testtable where name = 'test');");
});

test("prepareOptions with no parameter", function() {
	var preparedOpts = this.sql.__prepareOptions();
	ok($.isEmptyObject(preparedOpts),'When no input is given, output should be an empty object');
});

test("prepareOptions with null object", function() {
	var preparedOpts = this.sql.__prepareOptions(null);
	ok($.isEmptyObject(preparedOpts),'When null as input is given, output should be an empty object');
});

test("prepareOptions w/o required", function() {
	var opts = {test: 'test', some_property: 'some value'};
	var preparedOpts = this.sql.__prepareOptions(opts);
	deepEqual(preparedOpts,opts,'When no required options are given, the input should equal the output');
});

test("prepareOptions with required", function() {
	var opts = {test: 'test', some_property: 'some value'};
	var preparedOpts = this.sql.__prepareOptions(opts,['test','some_property']);
	deepEqual(preparedOpts,opts,'When all required options are given, the input should equal the output');
});

test("prepareOptions missing required option", function() {
	var sql = this.sql;
	var opts = {test: 'test', some_property: 'some value'};
	raises(function() {
		var preparedOpts = this.sql.__prepareOptions(opts,['missing_property']);
	}, "Missing required options should throw an error");
});

test("getCondition (empty string)", function() {
	var condition = ''
	var newCond = this.sql.__getCondition(condition);
	strictEqual(newCond,condition,'When the condition is empty, return empty string');
});

test("getCondition (correct string)", function() {
	var condition = "Text = 'value'";
	var newCond = this.sql.__getCondition(condition);
	strictEqual(newCond,condition,'When the condition is correct, return as-is');
});

test("getCondition (trim string)", function() {
	var condition = "    Text = 'value'    ";
	var newCond = this.sql.__getCondition(condition);
	strictEqual(newCond,"Text = 'value'",'Trim whitespace from condition');
});

test("getCondition (remove AND)", function() {
	var condition = "  AND    Text = 'value'    ";
	var newCond = this.sql.__getCondition(condition);
	strictEqual(newCond,"Text = 'value'",'Remove `AND` and trim whitespace from condition');
});

test("getCondition (multiple conditions as string)", function() {
	var condition = "   AND Number = 3 AND Text = 'value'    ";
	var newCond = this.sql.__getCondition(condition);
	strictEqual(newCond,"Number = 3 AND Text = 'value'",'Remove `AND` and trim whitespace from multiple conditions');
});

test("getCondition (multiple conditions as array)", function() {
	var conditions = ["   AND Number = 3","    AND  Text = 'value'    "];
	var newCond = this.sql.__getCondition(conditions);
	strictEqual(newCond,"Number = 3 AND Text = 'value'",'Remove `AND` and trim whitespace from multiple conditions');
});

test("checkFieldsAndValues w/o values", function() {
	var options = {};
	options.fields = [];
	options.values = [];
	
	ok(this.sql.__checkFieldsAndValues(options),'If no values are provided, check should pass');
});

test("checkFieldsAndValues with values", function() {
	var options = {};
	options.fields = ['1st','2nd','3rd'];
	options.values = ['value1','value2','value3'];
	
	ok(this.sql.__checkFieldsAndValues(options),'If the same number of values are provided, check should pass');
});

test("checkFieldsAndValues with missing values", function() {
	var sql = this.sql;
	var options = {};
	options.fields = ['1st','2nd','3rd'];
	options.values = ['value1','value2'];
	raises(function() {
		sql.__checkFieldsAndValues(options);
	}, "If values are missing, check should raise an exception");
});

test("checkFieldsAndValues with missing fields", function() {
	var sql = this.sql;
	var options = {};
	options.fields = ['1st','2nd'];
	options.values = ['value1','value2','value3'];
	raises(function() {
		sql.__checkFieldsAndValues(options);
	}, "If fields are missing, check should raise an exception");
});

test("isString (string)", function() {
	equal(this.sql.__isString('string'),true,'String is a string');
	equal(this.sql.__isString(''),true,'Empty string is a string');
	equal(this.sql.__isString(new String('string')),true,'String object is a string');
});

test("isString (no string)", function() {
	equal(this.sql.__isString({}),false,'Empty object is not a string');
	equal(this.sql.__isString([]),false,'Array is not a string');
	equal(this.sql.__isString(3),false,'Number is not a string');
});

test("splitToArray (string)", function() {
	var testStr = 'test , something else  , bla,blo';
	var testArr = ['test', 'something else', 'bla', 'blo'];
	deepEqual(this.sql.__splitToArray(testStr),testArr,'String should be splitted to array');
});

test("splitToArray (separator)", function() {
	var testStr = 'test.something . else .  bla  .blo';
	var testArr = ['test', 'something', 'else','bla', 'blo'];
	deepEqual(this.sql.__splitToArray(testStr,'.'),testArr,'String should be splitted to array');
});

test("splitToArray (string)", function() {
	var testObj = {test: 'test ', another:'something else'};
	deepEqual(this.sql.__splitToArray(testObj),testObj,'Object should kept as-is');
});