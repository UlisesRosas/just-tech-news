//this file will be used for collecting and exporting model data
// collectig user model
const User = require('./User');
// collecting post model
const Post = require("./Post");
// collecting thr vote model
const Vote = require('./Vote');
// collecting comment model
const Comment = require('./Comment');

// create associations
// this is a one to many association user id to a post or many posts.
User.hasMany(Post, {
    foreignKey: 'user_id'
  });

//   this is saying that a post is associated to one user id
Post.belongsTo(User, {
  foreignKey: 'user_id',
});

// creating a many to many association
// user and post are connected but through the vote model
User.belongsToMany(Post, {
  // connected through foreign key specified in the model
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  // connected through foreign key specified in the model
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

// creating direct relationships between users and votes as well as post and votes
// this is necesary to incriment and count the votes 
Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

// model association for comment model
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

// exporting user object table or in other words the models
module.exports = { User, Post, Vote, Comment};