const express = require("express");
const router = express.Router();
const updates = require("../models/updates");
const moment = require("moment");

const classifications = [
	{
		id: 1,
		value: "Security",
	},
	{
		id: 2,
		value: "Critical",
	},
];
const products = [
	{ id: 1, value: "Server 2019" },
	{ id: 2, value: "Server 2016" },
	{ id: 3, value: "Server 2012" },
	{ id: 4, value: "Windows 10 1803" },
	{ id: 5, value: "Windows 10 1903" },
	{ id: 6, value: "Office 2010" },
	{ id: 7, value: "Office 2013" },
	{ id: 8, value: "Windows 7" },
	{ id: 9, value: "Server 2008" },
	{ id: 10, value: "Windows 10 1607" },
	{ id: 11, value: "Windows 10 1709" },
];

const statuses = [
	{ id: 1, value: "Unapproved" },
	{ id: 2, value: "Approved" },
	{ id: 3, value: "Declined" },
];

// call selectAll function via updates model
router.get("/", (req, res) => {
	updates.all((data) => {
		res.redirect("/sort/kb/asc");
	});
});

// Sort on selected column.
router.get("/sort/:column/:direction", (req, res) => {
	if (typeof direction == "undefined") {
		direction = "asc";
	}
	updates.sort([req.params.column, req.params.direction], (result) => {
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
	});
});

// Filter for the desired status
router.get("/sort/:column/:direction/:status", (req, res) => {
	// get only updates with selected status
	console.log("updates_controller get sort/:col/:dir/:status");
	console.log(req.params);
	//updates.filter([req.params], (result) => {
	//
	console.log("updates_controller filter result");
	console.log(result);
	/* 
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
		}); */
	//});
});

router.post("/edit", (req, res) => {
	console.log("controller /edit");
	console.log(req.body);
	// update an update
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
