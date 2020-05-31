const express = require("express");
const router = express.Router();
const updates = require("../models/updates");
const moment = require("moment");

// Create the arrays that are sent to the view to render the select inputs
// TODO: figure out how to do this less redundantly
updates.getColumn(`product`, (result) => {
	product = result.map((item) => {
		const newObj = {
			id: item.id,
			value: item.product,
		};
		return newObj;
	});
});

updates.getColumn(`status`, (result) => {
	status = result.map((item) => {
		const newObj = {
			id: item.id,
			value: item.status,
		};
		return newObj;
	});
});

updates.getColumn(`classification`, (result) => {
	classification = result.map((item) => {
		const newObj = {
			id: item.id,
			value: item.classification,
		};
		return newObj;
	});
});

// call selectAll function via updates model
router.get("/", (req, res) => {
	// pass req.query to orm selectAll function
	// if empty, returns all columns unfiltered
	updates.all(req.query, (result) => {
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
				newObj.PublishDate = moment(item.PublishDate).format("YYYY/MM/DD");
			} else {
				newObj.PublishDate = "";
			}
			if (item.ResearchDate != "0000-00-00") {
				newObj.ResearchDate = moment(item.ResearchDate).format("YYYY/MM/DD");
			} else {
				newObj.ResearchDate = "";
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
			classification: classification,
			status: status,
			product: product,
			updates: parsedUpdates,
		});
	});
});

// Under construction...dynamic search
router.get("/search", (req, res) => {
	updates.search(req.query, (result) => {
		const parsedUpdates = result.map((item) => {
			const newObj = {
				KBArticle: item.KBArticle,
			};
			return newObj;
		});
		res.json({ updates: parsedUpdates });
	});
});

router.get("/bulk", (req, res) => {
	res.render("pages/home", { page: "main/bulkAdd" });
});

// POST Routes
// Process bulk add submission
router.post("/bulkAdd", (req, res) => {
	const parsedUpdateArr = req.body.bulkData.map((item) => {
		// get ids from product, status, and classification
		const newProduct = product.find((reference) => {
			return reference.value == item.product;
		});
		const newStatus = status.find((reference) => {
			return reference.value == item.status;
		});
		const newClassification = classification.find((reference) => {
			return reference.value == item.classification;
		});
		const newArr = [
			item.kb,
			newClassification.id.toString(),
			newStatus.id.toString(),
			item.details,
			newProduct.id.toString(),
			item.publishDate,
			item.url,
		];
		return newArr;
	});
	updates.add(parsedUpdateArr, (result) => {
		console.log("controller bulkAdd result");
		console.log(result);
		res.json(result);
	});
});

// add new update
router.post("/add", (req, res) => {
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

// call update query with new data from form
router.post("/edit", (req, res) => {
	updates.edit(
		[
			req.body.kb,
			req.body.classification,
			req.body.status,
			req.body.details,
			req.body.product,
			req.body.publishDate,
			req.body.url,
			req.body.uid,
		],
		(result) => {
			res.json({ id: result.insertId });
		}
	);
});

router.post("/delete", (req, res) => {
	console.log("controller delete id = " + req.body.id);
	updates.delete(req.body.id, (result) => {
		console.log("controller delete result:");
		console.log(result);
		res.json(result);
	});
});

module.exports = router;
