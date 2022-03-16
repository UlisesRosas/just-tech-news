// useed to hash the sensitive user information
const bcrypt = require('bcrypt');
// required for sequelize library
const { Model, DataTypes } = require('sequelize');
// this filw has connections to the server
const sequelize = require('../config/connection');

// create our User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}



// define table columns and configuration
// ionitializes the modals 
User.init(
    {
      // define an id column
      id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key. otherwise sequalize will make one for usso its beteer to define it ourselves
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
      },
      // define a username column
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // define an email column
      // and has built in validators
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email values in this table
        unique: true,
        // if allowNull is set to false, we can run our data through validators before creating the table data
        validate: {
          isEmail: true
        }
      },
      // define a password column
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // this means the password must be at least four characters long
          len: [4]
        }
      }
    },
    {
      hooks:{
// this is to pass in hooks objects that we will use for bcrypt to hash data
  // set up beforeCreate lifecycle "hook" functionality
  // it fires before a new instance of user us created
   async beforeCreate(newUserData) {
    // pass ijn salt value of 10 (salt has to do with incription)
    newUserData.password =  await bcrypt.hash(newUserData.password, 10);
      return newUserData;
  },
  // set up beforeUpdate lifecycle "hook" functionality
  // this is to hash the password when the user updates their password
  async beforeUpdate(updatedUserData) {
    updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
    return updatedUserData;
  }
      },
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'user'
    },
    
  );
  


module.exports = User;