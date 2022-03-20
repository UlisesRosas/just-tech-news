const router = require('express').Router();
const sequelize = require('../../config/connection');
// we need the post user and vote models because we are going to use related data from them
const { Post, User, Vote } = require('../../models');

// get all users
router.get('/', (req, res) => {
    console.log('======================');
    // getting all posts
    Post.findAll({
      // Query configuration that finds all of these post model props
    //   create at is a default property of sequalize that does not need to be specified in the model its just there
      attributes: [
        'id', 
        'post_url', 
        'title', 
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      // displays the posts in descending order 
      order: [['created_at', 'DESC']], 
      // this is the equivalent of joining in mySQL. It is expressed as an array of objects
    include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
    // passing all the data that was asked for in to the json response
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
    
  });

  router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
      'id', 
      'post_url', 
      'title', 
      'created_at'
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
// making a post by making a new entry in the post table or model
  router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
      // these are all inputs from the user that are going to the body of the json object
      title: req.body.title,
      post_url: req.body.post_url,
      user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// when oting we are updating the post data so we need to use a put route
// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
// custom static method created in models/Post.js
Post.upvote(req.body, { Vote })
.then(updatedPostData => res.json(updatedPostData))
.catch(err => {
  console.log(err);
  res.status(400).json(err);
  });  
});

// updates the post model 
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


  module.exports = router;