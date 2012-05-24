var global = this;

function GftLib () {
	if(this === global) { return new GftLib(); }
	gapi.auth.init();
	
	var _this = this;
	var sqlBuilder = new SqlBuilder();
	var accessToken = null;
	
	var GFT_PATH = '/fusiontables/v1/query';
	var ACCESS_TOKEN_URL = 'http://gft.rdmr.ch/services/OAuthToken.php?jsonp=?';
	var CLIENT_ID = '63601791805.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME';
	
	var sendRequest = function(request, callback) {
		gapi.client.setApiKey(API_KEY);
		var restRequest = gapi.client.request(request);
		if(restRequest != undefined) {
			restRequest.execute(callback);
		}
	}
	
	var readRequest = function(callback, query) {
		var authCb = function(success) {
			if (success) {
				var date = new Date();
				sendRequest({
					path: GFT_PATH,
					params: { 
						sql: query,
						key: API_KEY,
						rand: date.getTime()
					}
				}, callback);
			} else {
				callback(null,'Auth failed');
			}
		}
		auth(authCb);
	}
	
	var writeRequest = function(callback, query) {
		var authCb = function(success) {
			if (success) {
				var params = "sql=" + encodeURI(query) + "&";
				params += "access_token=" + encodeURI(accessToken) + "&";
				params += "client_id=" + encodeURI(CLIENT_ID) + "&";
				var date = new Date();
				params += "rand=" + date.getTime()
				sendRequest({
					path: GFT_PATH,
					body: params,
					headers: {
					  'Content-Type': 'application/x-www-form-urlencoded',
					  'Content-Length': params.length
					},
					method: 'POST'
				}, callback);
			} else {
				callback(null,'Auth failed');
			}
		}
		auth(authCb);
	}
	
	_this.execQuery = function(callback, query, scope) {
		readRequest(scopedDataCallback(callback,scope),query);
    };
	
	_this.execSql = function(callback, sql, scope) {
		writeRequest(scopedDataCallback(callback,scope),sql);
    };
	
	_this.execSelect = function(callback, options, scope) {
		readRequest(scopedDataCallback(callback,scope), sqlBuilder.selectStmt(options));
	};
	
	_this.execInsert = function(callback, options, scope) {
		writeRequest(scopedDataCallback(callback,scope), sqlBuilder.insertStmt(options));
	};
	
	_this.execUpdate = function(callback, options, scope) {
		writeRequest(scopedDataCallback(callback,scope), sqlBuilder.updateStmt(options));
	};
	
	_this.execDelete = function(callback, options, scope) {
		writeRequest(scopedDataCallback(callback,scope), sqlBuilder.deleteStmt(options));
	};
	
	_this.getTableDescription = function(callback, options, scope) {
		readRequest(scopedDataCallback(callback,scope), sqlBuilder.describeStmt(options));
	};
	
	_this.createView = function(callback, options, scope) {
		writeRequest(scopedDataCallback(callback,scope), sqlBuilder.createViewStmt(options));
	};
	
	_this.convertToObject = function(gftData) {
		var rows = gftData.rows;
		var cols = gftData.columns;
		var allObjects = new Array();
		
		if(rows && cols) {
			for (var rowNr = 0; rowNr < rows.length; rowNr++) {
				var gftObj = new Object();
				for (var colNr = 0; colNr < cols.length; colNr++) {
					var colName = cols[colNr];
					colName = colName.replace(/\s/g, ""); // remove spaces
					gftObj[colName.toLowerCase()] = rows[rowNr][colNr];
				}
				allObjects.push(gftObj);
			}
		}
		
		return allObjects;
	};
	
	_this.getAccessToken = function() {
		return accessToken;
	}
	
	_this.setAccessToken = function(token) {
		accessToken = token;
	}
	
	var auth = function(callback) {
		retrieveAccessToken(function(token) {
			if (typeof token === 'object') {
				gapi.auth.setToken(token);
			}
			var success = (accessToken !== null);
			callback.call(this, success);
		});
	}
	
	var retrieveAccessToken = function(callback) {
		if (!accessToken) {
			$.get(ACCESS_TOKEN_URL, function(data,status) {
				if (status == 'success') {
					accessToken = data.access_token;
				} else {
					accessToken = null;
				}
				callback.call(this, data, status);
			},"jsonp");
		} else {
			callback.call(this, accessToken);
		}
		return accessToken;
	}
	
	var scopedDataCallback = function(callback, scope) {
		if (!scope) {
			scope = _this;
		}
		return function(data, status) {
			callback.call(scope, data, status);
		}
	}
	
	//create alias methods for unit tests
	this.__sendRequest = sendRequest;
	this.__readRequest = readRequest;
	this.__writeRequest = writeRequest;
	this.__auth = auth;
	this.__retrieveAccessToken = retrieveAccessToken;
	this.__scopedDataCallback = scopedDataCallback;
	
	return _this;
}
