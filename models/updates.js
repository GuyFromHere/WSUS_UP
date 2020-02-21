const orm = require("../config/orm");

const updates = {
	all: cb => {
		orm.selectAll(res => {
			cb(res);
		});
	},
	update: (id, field, value, cb) => {
		// pass devourState from browser > controller > model and finally to orm
		orm.updateOne(id, field, value, res => {
			cb(res);
		});
	},
	add: (data, cb) => {
		orm.addUpdate(data, res => {
			cb(res);
		});
	}
};

module.exports = updates;
