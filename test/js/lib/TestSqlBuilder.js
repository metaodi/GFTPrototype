module("SqlBuilder", {
    setup: function() {
		this.testGftTableId = 'testtable';
	},
	teardown: function(){}
});

test("SELECT (fields)", function() {
	var gft = new GftLib;
	raises(function() {
		gft.select({fields:"*"});
	}, "must throw error to pass");
});

test("SELECT (fields, table)", function() {
	var sql = new SqlBuilder;
	equal(sql.selectStmt({fields:"Text, Number, Location", table:this.testGftTableId}), 'SELECT Text, Number, Location FROM ' + this.testGftTableId + ';');
});

test("SELECT (fields, table, condition)", function() {
	var sql = new SqlBuilder;
	equal(sql.selectStmt({table:this.testGftTableId, condition:"Text = 'Some record'"}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("SELECT (fields, table, condition with AND)", function() {
	var sql = new SqlBuilder;
	equal(sql.selectStmt({table:this.testGftTableId, condition:" AND Text = 'Some record'"}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("SELECT (fields, table, condition, orderby)", function() {
	var sql = new SqlBuilder;
	equal(sql.selectStmt({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC'}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' ORDER BY text DESC;");
});

test("SELECT (fields, table, condition, orderby, groupby)", function() {
	var sql = new SqlBuilder;
	equal(sql.selectStmt({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC', groupby:'Number'}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' GROUP BY Number ORDER BY text DESC;");
});

test("SELECT (fields, table, condition, orderby, groupby, limit)", function() {
	var sql = new SqlBuilder;
	equal(sql.selectStmt({table:this.testGftTableId, condition:"Text = 'Some record'", orderby:'text DESC', groupby:'Number', limit:4}), "SELECT * FROM " + this.testGftTableId + " WHERE Text = 'Some record' GROUP BY Number ORDER BY text DESC LIMIT 4;");
});

test("DESCRIBE table", function() {
	var sql = new SqlBuilder;
	equal(sql.describeStmt(this.testGftTableId), "DESCRIBE " + this.testGftTableId + ";");
});

test("INSERT", function() {
	var sql = new SqlBuilder;
	equal(sql.insertStmt({table:this.testGftTableId, fields:"Text, Number", values:"'Some record', 123"}), "INSERT INTO " + this.testGftTableId + " ( Text, Number ) VALUES ( 'Some record', 123 );");
});

test("DELETE", function() {
	var sql = new SqlBuilder;
	equal(sql.deleteStmt({table:this.testGftTableId}), "DELETE FROM " + this.testGftTableId + ";");
});

test("DELETE (condition)", function() {
	var sql = new SqlBuilder;
	equal(sql.deleteStmt({table:this.testGftTableId, condition:"Text = 'Some record'"}), "DELETE FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});

test("DELETE (condition with AND)", function() {
	var sql = new SqlBuilder;
	equal(sql.deleteStmt({table:this.testGftTableId, condition:"AND Text = 'Some record'"}), "DELETE FROM " + this.testGftTableId + " WHERE Text = 'Some record';");
});