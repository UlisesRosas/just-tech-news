// this file is for collecting all the api routes from the other files and then export them for node to see them

const router = require('express').Router();
// inports the routes we made in the user-routes.js file
const userRoutes = require('./user-routes.js');
// prefixing the routes we just collected to thid end point
router.use('/users', userRoutes);

module.exports = router;