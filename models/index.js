//this file will be used for collecting and exporting model data
// collectig user model
const User = require('./User');
// collecting post model
const Post = require("./Post");


// exporting user object table or in other words the models
module.exports = { User, Post};