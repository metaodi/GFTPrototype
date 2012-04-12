module("WorldData-Helper");

test("Functions available", function() {
	strictEqual(typeof(hex2rgb),'function','hex2rgb should be defined as function');
	strictEqual(typeof(formatNumber),'function','formatNumber should be defined as function');
	strictEqual(typeof(round),'function','round should be defined as function');
});

test("round()", function() {
	strictEqual(round(3.11,0), 3);
	strictEqual(round(3.12345678,2), 3.12);
	strictEqual(round(3.556,2), 3.56);
	strictEqual(round(1.008,1), 1);
	strictEqual(round(1.999999999999999999999999999999999999999999,2), 2);
	strictEqual(round(1.979999999999999999999999999999999999999999,2), 1.98);
	strictEqual(round(1.24498,2), 1.24);
	strictEqual(round(1.5566,0), 2);
});

test("formatNumber() - with separator", function() {
	strictEqual(formatNumber(1000000,","), "1,000,000");
	strictEqual(formatNumber(1234.12,","), "1,234.12");
	strictEqual(formatNumber(1,","), "1");
});

test("formatNumber() - without separator", function() {
	strictEqual(formatNumber(1000000), "1'000'000");
	strictEqual(formatNumber(1234.12), "1'234.12");
	strictEqual(formatNumber(1), "1");
});