const connection = require("./connection");

const insertQuery = `insert into wupdate (
	kb, classification_id, status_id, details, product_id, publishDate, url) 
	values ?`;

const updateQuery = `update wupdate 
	set kb = ?, classification_id = ?, status_id = ?, details = ?, 
	product_id = ?, publishDate = ?, url = ?
	where id = ?;`;

const selectOneQuery = `select ? as ? from ??`;

const selectAllQuery = `select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, 
	c.classification as Classification, u.publishDate as PublishDate, u.researchDate as ResearchDate, p.product as Product, u.url as URL 
	from wupdate u
	join status s on u.status_id = s.id
	join classification c on u.classification_id = c.id
	join product p on u.product_id = p.id
	`;

const deleteOneQuery = `DELETE FROM wupdate 	
	WHERE wupdate.id = ?`;

const orm = {
	// READ OPERATIONS
	// Get data for select inputs
	getColumn: (queryObj, cb) => {
		connection.query(`select * from ${queryObj};`, (err, result) => {
			if (err) throw err;
			cb(result);
		});
	},
	// construct query according to params passed from DOM
	getUpdates: (queryObj, cb) => {
		let sortVal;
		let sortCol;
		let filterStatement = `\n`;
		let sortStatement;
		// Add where clause if filter param is present
		if (typeof queryObj.filterCol != "undefined") {
			filterStatement =
				`where ${queryObj.filterCol} like "${queryObj.filterVal}"` + filterStatement;
		}
		// Set order by value
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
		let filterStatement = `\n`;

		if (typeof queryObj.filterCol != "undefined") {
			filterStatement =
				`where ${queryObj.filterCol} like "${queryObj.filterVal}"` + filterStatement;
		}
		// Default sort for results
		const sortStatement = `order by KB desc`;
		const query = selectAllQuery + filterStatement + sortStatement + ";";
		connection.query(query, (err, result, fields) => {
			if (err) throw err;
			if (result) {
				cb(result);
			}
		});
	},
	// EDIT OPERATIONS
	// Add new record(s) to DB
	addUpdate: (queryObj, cb) => {
		if (queryObj[0].constructor !== Array) {
			queryObj = [queryObj];
		}
		connection.query(insertQuery, [queryObj], (err, result) => {
			if (err) throw err;
			cb(result);
		});
	},
	//called when user edits an update on the update page
	updateOne: (queryObj, cb) => {
		connection.query(updateQuery, queryObj, (err, result, fields) => {
			if (err) throw err;
			cb(result);
		});
	},
	// Delete the selected row from the wupdate table
	deleteOne: (queryObj, cb) => {
		connection.query(deleteOneQuery, queryObj, (err, result, fields) => {
			if (err) throw err;
			cb(result);
		});
	},
};

module.exports = orm;

/* "45566785", "Updates",	"Approved",	"Server 2008", "01/10/2000", "",
"12121212", "Critical",	"Approved",	"Server 2016", "01/10/2012", "",
"4556677",	"Security",	"Unapproved", "Server 2019", "01/10/2013", "",
"4556677",	"Critical",	"Unapproved", "Server 2019", "01/10/2013", "",
"3023049",	"Upgrades",	"Superseded", "Office 2013", "06/07/2014", "", */
