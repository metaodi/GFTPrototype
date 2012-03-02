function GftLib () {
	this.GFT_URL = 'https://fusiontables.googleusercontent.com/fusiontables/api/query';
	
	this.doPost = function(url,params,callback) {
		var http = new XMLHttpRequest();
		http.open("POST", url, true);
		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", params.length);
		http.setRequestHeader("Connection", "close");
		
		http.onreadystatechange = function() {//Call a function when the state changes.
			if(http.readyState == 4) {
				callback.call(this, http.responseText, http.status);
			}
		}
		http.send(params);
	}
	
    this.select = function(query,callback) {
		var params = "sql=" + escape(query);
		this.doPost(this.GFT_URL, params, callback);
    };
}