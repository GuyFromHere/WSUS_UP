const orm = require("../config/orm");

const updates = {
	all: cb => {
		orm.selectAll(res => {
			cb(res);
		});
	},
	sort: (data, cb) => {
		orm.sort(data, res => {
			cb(res);
		});
	},
	edit: (data, cb) => {
		orm.updateOne(data, res => {
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
