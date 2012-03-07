/**
 * PhantomJS: QUnit test runner from https://github.com/ariya/phantomjs/blob/1.2/examples/run-qunit.js
 *
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 250ms
};

function ISODateString(d) {
    function pad(n){
        return n<10 ? '0'+n : n
    }
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z'
}

var generateJUnitXML = function(result) {
	console.log('<?xml version="1.0"?>');
	console.log('<!--\n ' + result.testresult + ' \n-->');
	
	var summaryArr = result.testresult.split("\n",3);
	var durationLine = summaryArr[0];
	var countLine = summaryArr[1];
	
	var duration = durationLine.match(/Tests completed in (\d+) milliseconds./)[1] / 1000;
	var countMatch = countLine.match(/(\d+) tests of (\d+) passed, (\d+) failed./);
	var testCount = countMatch[2];
	var failures = countMatch[3];
	var timestamp = ISODateString(new Date());
	
	console.log('<testsuite name="QUnit - JavaScript Tests" timestamp="'+ timestamp +'" tests="'+ testCount +'" failures="'+ failures +'" time="'+ duration +'">');
    var testList = document.createElement("ol");
	testList.innerHTML = result.tests_html;
	var testElements = testList.getElementsByTagName('li');
	for (var i = 0; i < testElements.length; i++) {
		var resultLine = testElements[i].innerText;
		var resultRE = /^(\w*): (\w+) \((\d+), (\d+), (\d+)\)Rerun/;
		var resultMatch = resultLine.match(resultRE);
		if (resultMatch) {
			var moduleName = resultMatch[1];
			var testName = resultMatch[2];
			var failure = resultMatch[3];
			console.log('<testcase name="'+ testName +'" classname="'+ moduleName +'">');
			if (failure > 0) {
				console.log('<failure message="'+ moduleName +'" type="'+ moduleName +'">');
				console.log(resultLine.replace(resultRE,''));
				console.log('</failure>');
			}
			console.log('</testcase>');
		}
	}
	console.log('</testsuite>');
};

var generateText = function(result) {
	console.log(result.testresult);
	console.log(result.tests);
}


if (phantom.args.length === 0 || phantom.args.length > 2) {
    console.log('Usage: run-qunit.js URL <TYPE>');
	console.log('TYPE: either text or junit-xml');
    phantom.exit();
}

var page = new WebPage();
var output = new Object();
output.type = phantom.args[1] || 'text';
output.fn = generateText;
if (output.type == 'junit-xml') {
	output.fn  = generateJUnitXML;
}


// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.open(phantom.args[0], function(status){
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
    } else {
        waitFor(function(){
            return page.evaluate(function(){
                var el = document.getElementById('qunit-testresult');
                if (el && el.innerText.match('completed')) {
                    return true;
                }
                return false;
            });
        }, function(){
            var failedNum = page.evaluate(function(){
                var el = document.getElementById('qunit-testresult');
                try {
                    return el.getElementsByClassName('failed')[0].innerHTML;
                } catch (e) { }
                return 10000;
            });
			var result = page.evaluate(function(){
				return {
					testresult: document.getElementById('qunit-testresult').innerText,
					testresult_html: document.getElementById('qunit-testresult').innerHTML,
					tests: document.getElementById('qunit-tests').innerText,
					tests_html: document.getElementById('qunit-tests').innerHTML
				}
			});
			output.fn(result);
            phantom.exit((parseInt(failedNum, 10) > 0) ? 1 : 0);
			
        },
		30000);
    }});
