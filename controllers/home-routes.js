const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            console.log(dbPostData[0]);
            // map makes a new array and the .get serializes that array
            const posts = dbPostData.map(post => post.get({ plain: true }));
            //   sice we are using handlebars we can reder thethe homepage.handelbars file
            // it can take in a second argument which is the data you want to display
            // pass a single post array into the homepage template
            res.render('homepage', {posts});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// route to render login.handlebars 
router.get('/login', (req, res) => {
    // in this case we dont have a variable like :id so we dont need that second argument in the .render()
    if (req.session.loggedIn) {
        // takes us to the homepage if we the session exists
        res.redirect('/');
        return;
      }
    
      res.render('login');
  });

module.exports = router;