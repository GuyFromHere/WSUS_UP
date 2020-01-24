const express = require('express');
const router = express.Router();

// Database
const conn = require('../../db/db');

router.get('/', (req, res) => {
    // put query function here

});

////////////////////////////////////////////////
// Load Partials 
////////////////////////////////////////////////

router.get('/showUpdates', (req, res) => {
    conn.query(`select u.kb as KBArticle, u.details as Details, s.status as Status, c.classification as Classification, p.product as Product 
    from wupdate u
    join status s on u.status_id = s.id
    join classification c on u.classification_id = c.id
    join product p on u.product_id = p.id;`, (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        const queryResult = result.map(item => {
            newItem = {
                kb: item.KBArticle,
                details: item.Details,
                status: item.Status,
                classification: item.Classification,
                product: item.Product
            }
            return newItem;
        })
        console.log(queryResult);
        res.render('pages/home', {
            page: '/main',
            updates: queryResult
        })
    })
});

router.get('/addUpdate', (req, res) => {
    res.render('pages/home', { page: 'addNotes' })
})

//////////////////////////////////////////
// Post
///////////////////////////////////////////
router.post('/addUpdate', (req, res) => {
    // put query function here
});

router.post('/filterUpdates', (req, res) => {
    // put query function here
})

router.post('/deleteUpdate/:id', (req, res) => {
    // put query function here
});

module.exports = router;