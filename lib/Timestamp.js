var global = this;

function Timestamp(timestamp) {
	if(this === global) {return new Timestamp();}
	
	var me = this;
	
	/*
	 * returns the date of current timestamp in given format
	 * 
	 * @param	format	string		output format of the date
	 * 
	 *			w		[0-6]		Numeric representation of the day of the week
	 *			j		[1-31]		Day of the month without leading zeros
	 *			d		[01-31]		Day of the month, 2 digits with leading zeros
	 *			n		[1-12]		Numeric representation of a month, without leading zeros
	 *			m		[01-12]		Numeric representation of a month, with leading zeros
	 *			Y		[YYYY]		A full numeric representation of a year, 4 digits
	 *			y		[YY]		A two digit representation of a year
	 *			G		[0-23]		24-hour format of an hour without leading zeros
	 *			H		[00-23]		24-hour format of an hour with leading zeros
	 *			i		[00-59]		Minutes with leading zeros
	 *			s		[00-59]		Seconds, with leading zeros
	 * 
	 * @return			string		date as string
	 * 
	 */
	me.getDate = function(format) {
		var date = new Date(me.getTimestamp() * 1000);
		
		if(!format || format == '') {
			format = 'd.m.Y H:i:s';
		}
		
		format = format.replace('w', date.getDay());
		var day = date.getDate();
		format = format.replace('j', day);
		if(format.indexOf('d') != -1) {
			if(day < 10) {
				day = '0' + day;
			}
			format = format.replace('d', day);
		}
		var month = date.getMonth() + 1;
		format = format.replace('n', month);
		if(format.indexOf('m') != -1) {
			if(month < 10) {
				month = '0' + month;
			}
			format = format.replace('m', month);
		}
		var year = date.getFullYear();
		format = format.replace('Y', year);
		format = format.replace('y', year.toString().substring(2));
		var hours = date.getHours();
		format = format.replace('G', hours);
		if(format.indexOf('H') != -1) {
			if(hours < 10) {
				hours = '0' + hours;
			}
			format = format.replace('H', hours);
		}
		if(format.indexOf('i') != -1) {
			var minutes = date.getMinutes();
			if(minutes < 10) {
				minutes = '0' + minutes;
			}
			format = format.replace('i', minutes);
		}
		if(format.indexOf('s') != -1) {
			var seconds = date.getSeconds();
			if(seconds < 10) {
				seconds = '0' + seconds;
			}
			format = format.replace('s', seconds);
		}
		
		return format;
	},
	
	me.getTimestamp = function() {
		return me.timestamp;
	}
	
	me.setTimestamp = function(timestamp) {
		switch(typeof timestamp) {
			case "object":
				if (timestamp instanceof Timestamp) {
					me.timestamp = timestamp.getTimestamp();
				} else if (timestamp instanceof Date) {
					me.timestamp = timestamp.getTime() / 1000;
				}
				break;
			case "number":
				me.timestamp = timestamp;
				break;
			default:
				throw new Error("Argument must either be a number, a Timestamp or a Date");
		}
	}
	
	/*
	 * Construct a new Timestamp object based on the given parameters
	 */
	if(arguments.length > 0) {
		me.setTimestamp(arguments[0]);
	} else {
		me.setTimestamp((new Date()).getTime() / 1000);
	}
	
	return me;
}

// toString override added to prototype of Timestamp class
Timestamp.prototype.toString = function() {
	return this.getDate();
}