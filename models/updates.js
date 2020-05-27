const orm = require("../config/orm");

const updates = {
	getColumn: (data, cb) => {
		orm.getColumn(data, (result) => {
			cb(result);
		});
	},
	all: (params, cb) => {
		orm.getUpdates(params, (result) => {
			cb(result);
		});
	},
	search: (params, cb) => {
		orm.searchUpdates(params, (result) => {
			cb(result);
		});
	},
	edit: (data, cb) => {
		orm.updateOne(data, (result) => {
			cb(result);
		});
	},
	add: (data, cb) => {
		orm.addUpdate(data, (result) => {
			cb(result);
		});
	},
	delete: (data, cb) => {
		orm.deleteOne(data, (result) => {
			cb(result);
		});
	},
};

module.exports = updates;
