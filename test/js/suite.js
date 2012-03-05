function importJs(scriptName) {
 console.log('Importing ' + scriptName);
 phantom.injectJs(scriptName);
}

console.log('Starting QUnit tests...');

//libraries
importJs("../lib/qunit/qunit.js");
importJs("../../lib/jquery-1.7.1/jquery-1.7.1.min.js");

//code to test
importJs("../../js-example/GftLib.js");

//test code
importJs("TestGftLib.js");

var usrTestScript = "TestGftLib.js";

//Run QUnit
var testsPassed = 0;
var testsFailed = 0;

//extend copied from QUnit.js
function extend(a, b) {
 for ( var prop in b ) {
  if ( b[prop] === undefined ) {
   delete a[prop];
  } else {
   a[prop] = b[prop];
  }
 }

 return a;
}

QUnit.begin({});

// Initialize the config, saving the execution queue
var oldconfig = extend({}, QUnit.config);
QUnit.init();
extend(QUnit.config, oldconfig);

QUnit.testDone = function(t) {
 if (0 === t.failed) 
  testsPassed++;
 else
  testsFailed++;
  
 console.log(t.name + ' completed: ' + (0 === t.failed ? 'pass' : 'FAIL'))
}

var running = true;
QUnit.done = function(i) {
 console.log(testsPassed + ' of ' + (testsPassed + testsFailed) + ' tests successful');
 console.log('TEST RUN COMPLETED (' + usrTestScript + '): ' + (0 === testsFailed ? 'SUCCESS' : 'FAIL')); 
 running = false;
}

//Instead of QUnit.start(); just directly exec; the timer stuff seems to invariably screw us up and we don't need it
QUnit.config.semaphore = 0;
while( QUnit.config.queue.length )
 QUnit.config.queue.shift()();

//wait for completion
var ct = 0;
while ( running ) {
 if (ct++ % 1000000 == 0) {
  console.log('queue is at ' + QUnit.config.queue.length);
 }
 if (!QUnit.config.queue.length) {
  QUnit.done();
 }
}

//exit code is # of failed tests; this facilitates Ant failonerror. Alternately, 1 if testsFailed > 0.
phantom.exit(testsFailed);


// run the tests


QUnit.begin(); // hacked b/c currently QUnit.begin is normally called on document.load
//QUnit.start();
