const connection = require("./connection");

const insertQuery = `insert into wupdate (
	kb, classification_id, status_id, details, product_id, url) 
	values (?, ?, ?, ?, ?, ?);`;

	//, classification_id = ?, status_id = ?, details = '?', product_id = ? 
const updateQuery = `update wupdate 
	set kb = ?, classification_id = ?, status_id = ?, details = ?, product_id = ?, url = ?
	where id = ?;`;
 
const orm = {
	selectAll: cb => {
		connection.query(
		`select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, p.product as Product, u.url as URL 
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
	getClassifications: cb => {
		connection.query(`select * from classification;`, (err, result, fields) => {
			if (err) throw err;
			cb(result);
		});
	},
	//called when user edits an update on the update page
	updateOne: (data, cb) => {
		connection.query(updateQuery, data, (err, result, fields) => {
			if (err) throw err;
			console.log('Rows affected:', result.affectedRows);
			cb(result);
		})
	},
	addUpdate: (data, cb) => {
		console.log('orm add');
		console.log(data);
		
		connection.query(
			insertQuery,
			(err, result) => {
				if (err) throw err;
				cb(result);
			}
		);
	}
};

module.exports = orm;
