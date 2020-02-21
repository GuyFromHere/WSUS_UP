const connection = require("./connection");

const orm = {
	selectAll: cb => {
		connection.query(
			`select u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, p.product as Product 
        from wupdate u
        join status s on u.status_id = s.id
        join classification c on u.classification_id = c.id
        join product p on u.product_id = p.id;`,
			(err, result, fields) => {
				if (err) throw err;
				cb(result);
			}
		);
	},
	//called when user edits an update on the update page
	updateOne: (id, field, value, cb) => {
		console.log("orm updateOne");
		console.log(id); // id of the row
		console.log(field); // field to update
		console.log(value); // new value for field
		//connection.query(`select `)
	},
	addUpdate: (data, cb) => {
		console.log("orm addUpdate");
		console.log(data);
	}
};

module.exports = orm;
