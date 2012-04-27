var global = this;

function GftLib () {
	if(this === global) { return new GftLib(); }
	gapi.auth.init();
	
	var _this = this;
	var sqlBuilder = new SqlBuilder();
	
	_this.GFT_PATH = '/fusiontables/v1/query';
	_this.ACCESS_TOKEN_URL = 'http://' +window.location.hostname+'/gft/services/OAuthToken.php';
	_this.clientId = '63601791805.apps.googleusercontent.com';
    _this.apiKey = 'AIzaSyCAI2GoGWfLBvgygLKQp5suUk3RCG7r_ME';
    _this.scope = 'https://www.googleapis.com/auth/fusiontables';
	_this.accessToken = null;
	
	// sends an ajax request to the Google API
	_this.sendRequest = function(request, callback) {
		gapi.client.setApiKey(_this.apiKey);
		var restRequest = gapi.client.request(request);
		if(restRequest != undefined) {
			restRequest.execute(callback);
		}
	}
	
	var scopedDataCallback = function(callback, scope) {
		if (!scope) {
			scope = _this;
		}
		return function(data, status) {
			callback.call(scope, data, status);
		}
	}
	
	// Run OAuth 2.0 authorization.
	_this.auth = function(callback) {
		getAccessToken(function(token) {
			if (typeof token === 'object') {
				gapi.auth.setToken(token);
			}
			var success = (_this.accessToken !== null);
			callback(success);
		});
	}
	
	var getAccessToken = function(callback) {
		if (_this.accessToken === null) {
			$.get(_this.ACCESS_TOKEN_URL, function(data,status) {
				if (status == 'success') {
					_this.accessToken = data.access_token;
				} else {
					success = false
					_this.accessToken = null;
				}
				callback(data);
			},"json");
		} else {
			callback(_this.accessToken);
		}
	}
	
	var readRequest = function(callback, query) {
		var authCb = function(success) {
			if (success) {
				_this.sendRequest({
					path: _this.GFT_PATH,
					params: { 
						sql: query,
						key: _this.apiKey
					}
				}, callback);
			} else {
				callback(null,'Auth failed');
			}
		}
		_this.auth(authCb);
	}
	
	var writeRequest = function(callback, query) {
		var authCb = function(success) {
			if (success) {
				var params = "sql=" + encodeURI(query) + "&";
				params += "access_token=" + encodeURI(_this.accessToken) + "&";
				params += "client_id=" + encodeURI(_this.clientId);
				_this.sendRequest({
					path: _this.GFT_PATH,
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
		_this.auth(authCb);
	}
	
	_this.execSql = function(callback, query, scope) {
		readRequest(scopedDataCallback(callback,scope),query);
    };
	
	_this.execSelect = function(callback, options, scope) {
		readRequest(scopedDataCallback(callback,scope), sqlBuilder.select(options));
	};
	
	_this.getTableDescription = function(callback, tableId, scope) {
		_readRequest(scopedDataCallback(callback,scope), sqlBuilder.describe(tableId));
	};
	
	_this.execInsert = function(callback, options, scope) {
		writeRequest(scopedDataCallback(callback,scope), sqlBuilder.insert(options));
	};
	
	_this.convertToObject = function(gftData) {
		var rows = gftData.rows;
		var cols = gftData.columns;
		var allObjects = new Array();
		
		for (var rowNr = 0; rowNr < rows.length; rowNr++) {
			var gftObj = new Object();
			for (var colNr = 0; colNr < cols.length; colNr++) {
				var colName = cols[colNr];
				colName = colName.replace(/\s/g, ""); // remove spaces
				gftObj[colName.toLowerCase()] = rows[rowNr][colNr];
			}
			allObjects.push(gftObj);
		}
		
		return allObjects;
	};
	
	//create alias methods for unit tests
	this.__readRequest = readRequest;
	this.__writeRequest = writeRequest;
	
	return _this;
}
