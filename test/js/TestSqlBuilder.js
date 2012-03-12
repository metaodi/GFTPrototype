module("SqlBuilder", {
    setup: function() {
		this.testGftTableId = 'testtable';
	},
	teardown: function(){}
});

test("Select (fields)", function() {
	var gft = new GftLib;
	raises(function() {
		gft.select("*");
	}, "must throw error to pass");
});

test("Select (fields, table)", function() {
	var sql = new SqlBuilder;
	equal(sql.select("*", this.testGftTableId), 'SELECT * FROM ' + this.testGftTableId + ';');
});

test("Select (fields, table, condition)", function() {
	var sql = new SqlBuilder;
	equal(sql.select("*", this.testGftTableId, "Text = 'Some record'"), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("Select (fields, table, condition with AND)", function() {
	var sql = new SqlBuilder;
	equal(sql.select("*", this.testGftTableId, " AND Text = 'Some record'"), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("Select (fields, table, condition, orderby)", function() {
	var sql = new SqlBuilder;
	equal(sql.select("*", this.testGftTableId, "Text = 'Some record'", 'text DESC'), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' ORDER BY text DESC;");
});