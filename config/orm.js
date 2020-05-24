const connection = require("./connection");

const insertQuery = `insert into wupdate (
	kb, classification_id, status_id, details, product_id, publishDate, url) 
	values (?, ?, ?, ?, ?, str_to_date(?, '%m/%d/%Y'), ?);`;

const updateQuery = `update wupdate 
	set kb = ?, classification_id = ?, status_id = ?, details = ?, 
	product_id = ?, publishDate = (str_to_date(?, '%m/%d/%Y')), url = ?
	where id = ?;`;

const selectAllQuery = `select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, 
	c.classification as Classification, u.publishDate as PublishDate, p.product as Product, u.url as URL 
	from wupdate u
	join status s on u.status_id = s.id
	join classification c on u.classification_id = c.id
	join product p on u.product_id = p.id
	`;

const orm = {
	// construct query according to params passed from DOM
	getUpdates: (queryObj, cb) => {
		let sortVal;
		let sortCol;
		let filterStatement = `\n`;
		let sortStatement;

		// where ${filterCol} = ${filterVal} 
		if (typeof queryObj.filterCol != "undefined" ) {
			filterStatement = `where ${queryObj.filterCol} = "${queryObj.filterVal}"` + filterStatement;
		}
		// Sort by kb / descending if no sort variables passed
		if (typeof queryObj.sortCol != "undefined" ) {
			sortCol = queryObj.sortCol;
		} else {
			sortCol = "KB";
		}
		if ( typeof queryObj.sortVal != "undefined" ) {
			sortVal = queryObj.sortVal;
		} else { 
			sortVal = "desc"; 
		}
		sortStatement = `order by ${sortCol} ${sortVal}`
		const query = selectAllQuery + filterStatement + sortStatement +  ";";
		connection.query(
			query,
			(err, result, fields) => {
				if (err) throw err;
				cb(result);
			}
		);
	},
	// call insert query to add a new record to DB
	addUpdate: (data, cb) => {
		connection.query(insertQuery, data, (err, result) => {
			if (err) throw err;
			cb(result);
		});
	},
};

module.exports = orm;
