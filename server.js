// NOTE that we had to update the starting dile in the package.json file so that node knows where to look for our file exports
const express = require('express');
// the file was renamed from routes to controller to keep MVC
const routes = require('./controllers/');
const path = require('path');
// inporting the connections to sequalize
const sequelize = require('./config/connection');
// setting uo the apps template engine of choice "handlebars"
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
// inport for session storage and sequalizeStore
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// variables to set up session object
const sess = {
  // this secret should come from the .env file
  secret: 'Super secret secret',
  // {} means tella our session to use cookies
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};
// .env lets server connect to the port that is proided by the environment insead
const PORT = process.env.PORT || 3001;

const app = express();


// middlewear for session
app.use(session(sess));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express.js middle wear that serves all content of a folder as static assets. Usually used for front end stuff
app.use(express.static(path.join(__dirname, 'public')));

// setting uo the apps template engine of choice "handlebars"
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);


// turn on connection to db and server
// sequalize.sync will connect the models to the data base. if it doesnt find a table it will crate it for you
// and if it already exist it will drop it to prevent duplicates when recreating
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
