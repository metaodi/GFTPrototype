function getDateString() {
	var d = new Date();
	return ('0' + d.getDate()).slice(-2) + '-'
			+ ('0' + (d.getMonth()+1)).slice(-2) + '-'
			+ d.getFullYear() + ' '
			+ ('0' + (d.getHours())).slice(-2) + ':'
			+ ('0' + (d.getMinutes())).slice(-2) + ':'
			+ ('0' + (d.getSeconds())).slice(-2);
}

function getUrlParams() {
	var params = {};
	var urlParts = location.href.match(/\?(.*)$/i);
	var queryString = urlParts ? urlParts[1] : '';
	var paramRegex = /([^&=]+)(=([^&]*))?/g;
	var m;
	
	while (m = paramRegex.exec(queryString)) {
		params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	return params;
}

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

Ext.Loader.setPath('Ext', 'http://localhost/gft/usecases/fixmystreet/app');
Ext.Loader.setPath('FixMyStreet', 'http://localhost/gft/usecases/fixmystreet/app');

var params = getUrlParams();
if (params.debug != undefined) {
	console.log('######################################');
	console.log('#        DEBUG MODE ENABLED          #');
	console.log('######################################');
	console.log('');
	
	QUnit.begin = function() {
		console.log('####');
	}
	
	QUnit.testStart = function(test) {
		var module = test.module ? test.module : '';
		console.log('#' + module + " " + test.name + ": started.");
	}

	QUnit.testDone = function(test) {
		var module = test.module ? test.module : '';
		console.log('#' + module + " " + test.name + ": done.");
		console.log('####')
	}
}