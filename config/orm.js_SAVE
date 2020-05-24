const connection = require("./connection");

const insertQuery = `insert into wupdate (
	kb, classification_id, status_id, details, product_id, publishDate, url) 
	values (?, ?, ?, ?, ?, str_to_date(?, '%m/%d/%Y'), ?);`;

const updateQuery = `update wupdate 
	set kb = ?, classification_id = ?, status_id = ?, details = ?, 
	product_id = ?, publishDate = (str_to_date(?, '%m/%d/%Y')), url = ?
	where id = ?;`;

const selectAllQuery = `select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, u.publishDate as PublishDate, p.product as Product, u.url as URL 
	from wupdate u
	join status s on u.status_id = s.id
	join classification c on u.classification_id = c.id
	join product p on u.product_id = p.id
	`;

const orm = {
	selectAll: (cb) => {
		console.log('orm selectAll');
		connection.query(
			`select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, u.publishDate as PublishDate, p.product as Product, u.url as URL 
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
	// TEST
	// construct query according to params passed from DOM
	getUpdates: (queryObj, cb) => {
		console.log('orm getUpdates queryObj');
		console.log(queryObj)
		let sortDir;
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
		if ( typeof queryObj.sortDir != "undefined" ) {
			sortDir = queryObj.sortDir;
		} else { 
			sortDir = "desc"; 
		}
		sortStatement = `order by ${sortCol} ${sortDir}`
		const query = selectAllQuery + filterStatement + sortStatement +  ";";
		console.log('orm getUpdates query:');
		console.log(query);
		connection.query(
			query,
			(err, result, fields) => {
				if (err) throw err;
				cb(result);
			}
		);
	},
	sort: (data, cb) => {
		console.log('orm sort');
		// pass column and direction (asc or desc) as arguments from DOM
		connection.query(
			`select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, u.publishDate as PublishDate, p.product as Product, u.url as URL 
        from wupdate u
        join status s on u.status_id = s.id
        join classification c on u.classification_id = c.id
		join product p on u.product_id = p.id
		order by ?? ${data[1]};`,
			data,
			(err, result, fields) => {
				if (err) throw err;
				cb(result);
			}
		);
	},
	// route: get /filter/:param
	filter: (data, cb) => {
		console.log("orm filter");
		console.log(data.status);
		// pass column and direction (asc or desc) as arguments from DOM
		connection.query(
			`select u.id as uid, u.kb as KBArticle, u.details as Details, s.status as Status,
			c.classification as Classification, u.publishDate as PublishDate, p.product as Product,
			u.url as URL
			from wupdate u
			join status s on u.status_id = s.id
			join classification c on u.classification_id = c.id
			join product p on u.product_id = p.id
			WHERE s.status = ?`,
			data.status,
			(err, result, fields) => {
				if (err) throw err;
				cb(result);
			}
		);
	},
	//called when user edits an update on the update page
	updateOne: (data, cb) => {
		connection.query(updateQuery, data, (err, result, fields) => {
			if (err) throw err;
			console.log("Rows affected:", result.affectedRows);
			cb(result);
		});
	},

	addUpdate: (data, cb) => {
		console.log("orm add");
		console.log(data);
		connection.query(insertQuery, data, (err, result) => {
			if (err) throw err;
			cb(result);
		});
	},
};

module.exports = orm;
