module("SqlBuilder", {
    setup: function() {
		this.testGftTableId = 'testtable';
	},
	teardown: function(){}
});

test("Select (fields)", function() {
	var gft = new GftLib;
	raises(function() {
		gft.select({fields:"*"});
	}, "must throw error to pass");
});

test("Select (fields, table)", function() {
	var sql = new SqlBuilder;
	equal(sql.select({fields:"Text, Number, Location", table:this.testGftTableId}), 'SELECT Text, Number, Location FROM ' + this.testGftTableId + ';');
});

test("Select (fields, table, condition)", function() {
	var sql = new SqlBuilder;
	equal(sql.select({table:this.testGftTableId, condition:"Text = 'Some record'"}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("Select (fields, table, condition with AND)", function() {
	var sql = new SqlBuilder;
	equal(sql.select({table:this.testGftTableId, condition:" AND Text = 'Some record'"}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("Select (fields, table, condition, orderby)", function() {
	var sql = new SqlBuilder;
	equal(sql.select({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC'}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' ORDER BY text DESC;");
});

test("Select (fields, table, condition, orderby, groupby)", function() {
	var sql = new SqlBuilder;
	equal(sql.select({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC', groupby:'Number'}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' GROUP BY Number ORDER BY text DESC;");
});

test("Select (fields, table, condition, orderby, groupby limit)", function() {
	var sql = new SqlBuilder;
	equal(sql.select({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC', groupby:'Number', limit:4}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' GROUP BY Number ORDER BY text DESC LIMIT 4;");
});