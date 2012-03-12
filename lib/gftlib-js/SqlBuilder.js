function SqlBuilder () {
	this.select = function(fields, table, condition, orderby, groupby, limit) {
		if(arguments.length >= 2) {
			var select = "";
			select += "SELECT " + fields;
			select += " FROM " + table;
			if(condition) {
				condition = $.trim(condition);
				// if condition begins with AND -> remove AND
				if(condition.substr(0,3) == 'AND') {
					condition = condition.substr(4,condition.length);
				}
				select += " WHERE " + condition;
			}
			if(orderby) {
				select += " ORDER BY " + orderby;
			}
			if(groupby) {
				select += " GROUPBY " + groupby;
			}
			if(limit) {
				select += " LIMIT " + limit;
			}
			return select + ";";
		}
		throw new Error("two or more parameters required");
	}
}