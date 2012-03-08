module("SqlBuilder");
var testGftTableId = 'testtable';

test("Select (fields)", function() {
	var gft = new GftLib;
	raises(function() {
		gft.select("*");
	}, "must throw error to pass");
});

test("Select (fields, table)", function() {
	var sql = new SqlBuilder;
	equal(sql.select("*", testGftTableId), 'SELECT * FROM ' + testGftTableId + ';');
});

test("Select (fields, table, condition)", function() {
	var sql = new SqlBuilder;
	equal(sql.select("*", testGftTableId, "Text = 'Some record'"), "SELECT * FROM " + testGftTableId + " WHERE Text = 'Some record';");
});

test("Select (fields, table, condition with AND)", function() {
	var sql = new SqlBuilder;
	equal(sql.select("*", testGftTableId, " AND Text = 'Some record'"), "SELECT * FROM " + testGftTableId + " WHERE Text = 'Some record';");
});

test("Select (fields, table, condition, orderby)", function() {
	var sql = new SqlBuilder;
	equal(sql.select("*", testGftTableId, "Text = 'Some record'", 'text DESC'), "SELECT * FROM " + testGftTableId + " WHERE Text = 'Some record' ORDERBY text DESC;");
});