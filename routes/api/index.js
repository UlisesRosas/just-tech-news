// this file is for collecting all the api routes from the other files and then export them for node to see them

const router = require('express').Router();
// inports the routes we made in the user-routes.js file
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes.js');
const commentRoutes = require('./comment-routes');
// prefixing the routes we just collected to their end point
router.use('/users', userRoutes);
router.use('/posts', postRoutes)
// now all the routes in the comment_routes will have a /comments prefix without having to write it
router.use('/comments', commentRoutes);

module.exports = router;