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
	{ id: 4, value: "Windows 10 1803" },
	{ id: 5, value: "Windows 10 1903" },
	{ id: 6, value: "Office 2010" }
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

router.get("/sort/:column/:direction", (req, res) => {
	updates.sort([req.params.column, req.params.direction], result => {
		console.log("controller sort result");
		console.log(result);
		res.render("pages/home", {
			page: "main",
			classifications: classifications,
			statuses: statuses,
			products: products,
			updates: result
		});
	});
});

router.post("/edit", (req, res) => {
	// update an update
	updates.edit(
		[
			req.body.kb,
			req.body.classification,
			req.body.status,
			req.body.details,
			req.body.product,
			req.body.url,
			req.body.uid
		],
		result => {
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
			req.body.url
		],
		result => {
			res.json({ id: result.insertId });
		}
	);
});

module.exports = router;
