const orm = require("../config/orm");

const updates = {
	all: (params, cb) => {
		orm.getUpdates(params, result => {
			/* console.log('model getUpdates result:');
			console.log(result); */
			cb(result);
		})
		/* orm.selectAll(result => {
			cb(result);
		}); */
	},
	sort: (data, cb) => {
		orm.sort(data, result => {
			cb(result);
		});
	},
	filter: (data, cb) => {
		orm.filter(data, result => {
			cb(result);
		})
	},
	edit: (data, cb) => {
		orm.updateOne(data, result => {
			cb(result);
		});
	},
	add: (data, cb) => {
		orm.addUpdate(data, result => {
			cb(result);
		});
	}
};

module.exports = updates;
