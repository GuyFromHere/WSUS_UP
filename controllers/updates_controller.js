const express = require("express");
const router = express.Router();
const updates = require("../models/updates");

const classifications = [
	{
		id: 1,
		value: "Security"
	},
	{
		id: 2,
		value: "Critical"
	}
];
const products = [
	{ id: 1, value: "Server 2019" },
	{ id: 2, value: "Server 2016" },
	{ id: 3, value: "Server 2012" },
	{ id: 3, value: "Windows 10 1803" },
	{ id: 4, value: "Windows 10 1903" },
	{ id: 5, value: "Office 2010" }
];
const statuses = [
	{ id: 1, value: "Unapproved" },
	{ id: 2, value: "Approved" },
	{ id: 3, value: "Declined" }
];

// call selectAll function via updates model
router.get("/", (req, res) => {
	updates.all(data => {
		res.render("pages/home", {
			page: "main",
			classifications: classifications,
			statuses: statuses,
			products: products,
			updates: data
		});
	});
});

/* router.get("/add", (req, res) => {
	// show updates page
	res.render("pages/home", { page: "add" });
}); */

router.post("/update", (req, res) => {
	// update an update
	console.log("updates controller /update");

	res.render("pages/home", {
		page: "main",
		updates: data
	});
});

router.post("/add", (req, res) => {
	// add new update
	console.log("updates controller post add");
	console.log([
		req.body.kb,
		req.body.classification,
		req.body.status,
		req.body.details,
		req.body.product
	]);
	updates.add(
		[req.body.kb, req.body.classification, req.body.status, req.body.details, req.body.product],
		result => {
			const newObj = {
				kb: req.body.kb,
				classification: req.body.classification,
				status: req.body.status,
				details: req.body.details,
				product: req.body.product
			};
			res.json({ id: result.insertId });
		}
	);
});

module.exports = router;
