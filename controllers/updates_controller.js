const express = require("express");
const router = express.Router();
const updates = require("../models/updates");

// call selectAll function via updates model
router.get("/", (req, res) => {
	updates.all(data => {
		res.render("pages/home", {
			page: "main",
			updates: data
		});
	});
});

router.get("/add", (req, res) => {
	// show updates page
	res.render("pages/home", { page: "add" });
});

router.post("/update", (req, res) => {
	// update an update
	console.log("updates controller /update");

	res.render("pages/home", {
		page: "main",
		updates: data
	});
});

module.exports = router;
