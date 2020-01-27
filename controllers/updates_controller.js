const express = require("express");
const router = express.Router();
const updates = require('../models/updates');

// call selectAll function via updates model
router.get("/", (req, res) => {
    updates.all((data) => {
        res.render('pages/home', { 
            page: 'main',
            updates: data
         });
    });
});

module.exports = router;