const router = require('express').Router();
let apiRouter = router
    .use('/updates', require('../routes/updateRoutes'))
    .use('/', require('../routes/defaultRoutes'));
module.exports = apiRouter;