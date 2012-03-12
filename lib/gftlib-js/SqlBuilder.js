function SqlBuilder () {
	this.select = function(options) {
		options = options || {};
		options.table     = options.table     || null;
		options.fields    = options.fields    || "*";
		options.condition = options.condition || null;
		options.groupby   = options.groupby   || null;
		options.orderby   = options.orderby   || null;
		options.limit     = options.limit     || null;
		
		if(options.table) {
			var select = "";
			select += "SELECT " + options.fields;
			select += " FROM " + options.table;
			if(options.condition) {
				var condition = $.trim(options.condition);
				// if condition begins with AND -> remove AND
				if(condition.substr(0,3) == 'AND') {
					condition = condition.substr(4,condition.length);
				}
				select += " WHERE " + condition;
			}
			if(options.groupby) {
				select += " GROUP BY " + options.groupby;
			}
			if(options.orderby) {
				select += " ORDER BY " + options.orderby;
			}
			if(options.limit) {
				select += " LIMIT " + options.limit;
			}
			return select + ";";
		}
		throw new Error("Table must be specified");
	}
}