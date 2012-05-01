var global = this;

function UniqueId(size) {
	if(this === global) { return new UniqueId(); }
	
	this.size = 50;
	this.setSize = function(size) {
		this.size = size;
	}
	this.getSize = function() {
		return this.size;
	}
	
	function getRandomNumber(range) {
		return Math.floor(Math.random() * range);
	}
	function getRandomChar() {
		var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
		return chars.substr(getRandomNumber(chars.length), 1);
	}
	
	this.generateUid = function() {
		var str = "";
		for(var i = 0; i < this.getSize(); i++) {
			str += getRandomChar();
		}
		return str;
	}
	
	if(arguments.length > 0) {
		this.setSize(arguments[0]);
	}
	
	return this;
}