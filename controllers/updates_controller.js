const express = require("express");
const router = express.Router();
const updates = require("../models/updates");
const moment = require("moment");

var products;

updates.getColumn(`product`, result => {
	products = result.map(item => {
		const newObj = {
			id: item.id,
			value: item.product 
		}
		return newObj;
	})
})

updates.getColumn(`status`, result => {
	statuses = result.map(item => {
		const newObj = {
			id: item.id,
			value: item.status 
		}
		return newObj;
	})
})

updates.getColumn(`classification`, result => {
	classifications = result.map(item => {
		const newObj = {
			id: item.id,
			value: item.classification 
		}
		return newObj;
	})
})

// call selectAll function via updates model
router.get("/", (req, res) => {
	// pass req.query to orm selectAll function
	// if empty, returns all columns unfiltered
	updates.all(req.query, result => {
		const parsedUpdates = result.map((item) => {
			const newObj = {
				uid: item.uid,
				KBArticle: item.KBArticle,
				Classification: item.Classification,
				Status: item.Status,
				Details: item.Details,
				Product: item.Product,
				URL: item.URL,
			};
			if (item.PublishDate != "0000-00-00") {
				newObj.PublishDate = moment(item.PublishDate).format("MM/DD/YYYY");
			} else {
				newObj.PublishDate = "";
			}
			if (item.URL) {
				newObj.URL = item.URL;
			} else {
				newObj.URL = "";
			}
			return newObj;
		});
		res.render("pages/home", {
			page: "main/main",
			classifications: classifications,
			statuses: statuses,
			products: products,
			updates: parsedUpdates,
		});
	})
});

router.get("/search", (req, res) => {
	// 
	console.log('controller search')
	updates.search(req.query, result => {
		const parsedUpdates = result.map((item) => {
			const newObj = {
				uid: item.uid,
				KBArticle: item.KBArticle,
				Classification: item.Classification,
				Status: item.Status,
				Details: item.Details,
				Product: item.Product,
				URL: item.URL,
			};
			if (item.PublishDate != "0000-00-00") {
				newObj.PublishDate = moment(item.PublishDate).format("MM/DD/YYYY");
			} else {
				newObj.PublishDate = "";
			}
			if (item.URL) {
				newObj.URL = item.URL;
			} else {
				newObj.URL = "";
			}
			return newObj;
		});
		res.render("pages/home", {
			page: "main/main",
			classifications: classifications,
			statuses: statuses,
			products: products,
			updates: parsedUpdates,
		});
	})
});

router.post("/add", (req, res) => {
	// add new update
	updates.add(
		[
			req.body.kb,
			req.body.classification,
			req.body.status,
			req.body.details,
			req.body.product,
			req.body.publishDate,
			req.body.url,
		],
		(result) => {
			res.json({ id: result.insertId });
		}
	);
});

module.exports = router;
