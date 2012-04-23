module("Timestamp", {
    setup: function() {
		this.ts = new Timestamp(new Date(86,10,17,11,3,0,0));
	},
	teardown: function(){}
});

test("Construtor without timestamp", function() {
	var nowDate = new Date();
	var nowTs = new Timestamp();
	
	ok(nowTs instanceof Timestamp, 'Object should be of type Timestamp or one of it\'s childs');
	deepEqual(Math.round(nowTs.getTimestamp()), Math.round(nowDate.getTime() / 1000));
	notDeepEqual(Math.round(nowTs.getTimestamp()), Math.round(this.ts.getTimestamp()));
});

test("Construtor with number", function() {
	var timestamp = 1335165385;
	var ts = new Timestamp(timestamp);
	
	ok(ts instanceof Timestamp, 'Object should be of type Timestamp or one of it\'s childs');
	deepEqual(ts.getTimestamp(), timestamp);
});

test("Construtor with Timestamp", function() {
	var nowTs = new Timestamp();
	var ts = new Timestamp(nowTs);
	
	ok(ts instanceof Timestamp, 'Object should be of type Timestamp or one of it\'s childs');
	deepEqual(ts.getTimestamp(), nowTs.getTimestamp());
});

test("Construtor with Date", function() {
	var myDate = new Date(86,10,17,11,3,0);
	var ts = new Timestamp(myDate);
	
	ok(ts instanceof Timestamp, 'Object should be of type Timestamp or one of it\'s childs');
	deepEqual(ts.getTimestamp(), myDate.getTime() / 1000);
});

test("Construtor with wrong timestamp", function() {
	raises(function() {
		var wrongDate = 'random string that is not a date';
		var paramTs = new Timestamp(wrongDate);
	}, "Constructor with wrong parameter should throw error");
});

test("Public Methods", function() {
	deepEqual(typeof this.ts.getDate, 'function', 'Public function should exist');
	deepEqual(typeof this.ts.getTimestamp, 'function', 'Public function should exist');
	deepEqual(typeof this.ts.setTimestamp, 'function', 'Public function should exist');
	deepEqual(typeof this.ts.toString, 'function', 'Public function should exist');
});

test("getDate() without format", function() {
	var myDate = new Date(1986,8,17,9,3,8,0);
	var ts = new Timestamp(myDate);
	deepEqual(ts.getDate(), '17.09.1986 09:03:08');
});

test("getDate() with format", function() {
	var myDate = new Date(2012,3,9,8,9,59,0);
	var ts = new Timestamp(myDate);
	deepEqual(ts.getDate('y-n-j G:i'), '12-4-9 8:09');
});

asyncTest("setTimestamp()", 3, function() {
	var firstTs = new Timestamp();
	var ts = new Timestamp(firstTs);
	deepEqual(ts.getTimestamp(), firstTs.getTimestamp());
	
	setTimeout(function() {
		ts.setTimestamp(new Timestamp());
		notDeepEqual(ts.getTimestamp(), firstTs.getTimestamp());
		deepEqual(Math.round(ts.getTimestamp()-firstTs.getTimestamp()), 1);
		start();
	}, 1000);
	
});

test("setTimestamp() with wrong parameter", function() {
	var ts = new Timestamp();
	raises(function() {
		var wrongDate = 'string that is not a date';
		ts.setTimestamp(wrongDate);
	}, "Constructor with wrong parameter should throw error");
});