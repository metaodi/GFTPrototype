/**
 * Converts a given hex-value color to a rgb-value color.
 * If opacity is available it's converted to a rgba-value color.
 * 
 * @param	hex	string	color in hex-value
 * @param	opacity	number	opacity of color (0-1)
 * @return	string	rgb or rgba value of color
 */
function hex2rgb(hex, opacity) {
	var rgb = hex.replace('#', '').match(/(.{2})/g);
	var i = 3;
	
	while (i--) {
		rgb[i] = parseInt(rgb[i], 16);
	}
	if (typeof opacity == 'undefined') {
		return 'rgb(' + rgb.join(', ') + ')';
	}
	
	return 'rgba(' + rgb.join(', ') + ', ' + opacity + ')';
}

/**
 * Adds thousand separators to a given number
 * 
 * @param	number	number	a number without styling
 * @param	thousandSeparator	string	used as thousand separator
 * @return	string	number with thousand separators
 */
function formatNumber(number, thousandSeparator) {
	var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
	number = number.toString();
	
	if(!thousandSeparator) {
		thousandSeparator = '\'';
	}
	while(sRegExp.test(number)) {
		number = number.replace(sRegExp, '$1' + thousandSeparator + '$2');
	}
	
	return number;
}

/**
 * Rounds a given number to n digits
 * 
 * @param	number	number	a number with many digits
 * @param	n_digits	number	number of digits which should be displayed
 * @return	number	a rounded number
 */
function round(number, n_digits){
   n_digits = (n_digits == "" || n_digits == 0 ? 1 : Math.pow(10, n_digits));
   number = Math.round(number * n_digits) / n_digits;
   
   return number;
}