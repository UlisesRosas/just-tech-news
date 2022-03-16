// NOTE that we had to update the starting dile in the package.json file so that node knows where to look for our file exports
const express = require('express');
const routes = require('./routes');
// inporting the connections to sequalize
const sequelize = require('./config/connection');

const app = express();
// .env lets server connect to the port that is proided by the environment insead
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
// sequalize.sync will connect the models to the data base. if it doesnt find a table it will crate it for you
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
