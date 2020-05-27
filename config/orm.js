const connection = require("./connection");

const insertQuery = `insert into wupdate (
	kb, classification_id, status_id, details, product_id, publishDate, url) 
	values (?, ?, ?, ?, ?, str_to_date(?, '%m/%d/%Y'), ?);`;

let bulkInsertQuery = `insert into wupdate (
	kb, classification_id, status_id, details, product_id, publishDate, url) 
	values (?, ?, ?, ?, ?, str_to_date(?, '%m/%d/%Y'), ?);`;

const updateQuery = `update wupdate 
	set kb = ?, classification_id = ?, status_id = ?, details = ?, 
	product_id = ?, publishDate = (str_to_date(?, '%m/%d/%Y')), url = ?
	where id = ?;`;

const selectAllQuery = `select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, 
	c.classification as Classification, u.publishDate as PublishDate, u.researchDate as ResearchDate, p.product as Product, u.url as URL 
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
		if (typeof queryObj.filterCol != "undefined") {
			//filterStatement = `where ${queryObj.filterCol} = "${queryObj.filterVal}"` + filterStatement;
			filterStatement =
				`where ${queryObj.filterCol} like "${queryObj.filterVal}"` + filterStatement;
		}
		// Sort by kb / descending if no sort variables passed
		if (typeof queryObj.sortCol != "undefined") {
			sortCol = queryObj.sortCol;
		} else {
			sortCol = "KB";
		}
		if (typeof queryObj.sortVal != "undefined") {
			sortVal = queryObj.sortVal;
		} else {
			sortVal = "desc";
		}
		sortStatement = `order by ${sortCol} ${sortVal}`;
		const query = selectAllQuery + filterStatement + sortStatement + ";";
		connection.query(query, (err, result, fields) => {
			if (err) throw err;
			cb(result);
		});
	},
	// Dynamic search. Under construction.
	searchUpdates: (queryObj, cb) => {
		let sortVal;
		let sortCol;
		let filterStatement = `\n`;
		let sortStatement;

		// where ${filterCol} = ${filterVal}
		if (typeof queryObj.filterCol != "undefined") {
			//filterStatement = `where ${queryObj.filterCol} = "${queryObj.filterVal}"` + filterStatement;
			filterStatement =
				`where ${queryObj.filterCol} like "${queryObj.filterVal}"` + filterStatement;
		}
		// Sort by kb / descending if no sort variables passed
		if (typeof queryObj.sortCol != "undefined") {
			sortCol = queryObj.sortCol;
		} else {
			sortCol = "KB";
		}
		if (typeof queryObj.sortVal != "undefined") {
			sortVal = queryObj.sortVal;
		} else {
			sortVal = "desc";
		}
		sortStatement = `order by ${sortCol} ${sortVal}`;
		const query = selectAllQuery + filterStatement + sortStatement + ";";
		connection.query(query, (err, result, fields) => {
			if (err) throw err;
			if (result) {
				console.log("orm searchUpdates result");
				console.log(result);
				cb(result);
			}
		});
	},
	// call insert query to add a new record to DB
	addUpdate: (data, cb) => {
		console.log("orm addUpdate query and data");
		console.log(insertQuery);
		console.log(data);
		connection.query(insertQuery, data, (err, result) => {
			if (err) throw err;
			cb(result);
		});
	},
	// call insert query to add a new record to DB
	bulkAddUpdates: (data, cb) => {
		console.log("orm bulkAddUpdates query and data");
		console.log(bulkInsertQuery);
		console.log(data);
		connection.query(bulkInsertQuery, [data], (err, result) => {
			if (err) throw err;
			cb(result);
		});
	},
	//called when user edits an update on the update page
	updateOne: (data, cb) => {
		connection.query(updateQuery, data, (err, result, fields) => {
			if (err) throw err;
			console.log("updateOne: Rows affected:", result.affectedRows);
			cb(result);
		});
	},
	getColumn: (data, cb) => {
		connection.query(`select * from ${data};`, (err, result) => {
			if (err) throw err;
			cb(result);
		});
	},
};

module.exports = orm;
