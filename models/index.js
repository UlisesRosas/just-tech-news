//this file will be used for collecting and exporting model data
// collectig user model
const User = require('./User');
// collecting post model
const Post = require("./Post");

// create associations
// this is a one to many association user id to a post or many posts.
User.hasMany(Post, {
    foreignKey: 'user_id'
  });

//   this is saying that a post is associated to one user id
Post.belongsTo(User, {
  foreignKey: 'user_id',
});

// exporting user object table or in other words the models
module.exports = { User, Post};