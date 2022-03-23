// this file also serves to collect other routes from the api sub directoriee 

const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');

// prefixes the routes we just collected to this endpoint
router.use('/api', apiRoutes);
router.use('/', homeRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
