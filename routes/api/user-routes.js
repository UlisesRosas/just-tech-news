const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
      // Access our User model and run .findAll() method) .findall() is equivalent to SELECT * FROM in mySQL
  User.findAll({
    // we want to hide this info from the user so we exclude the attribute
    attributes: { exclude: ['password'] 
  }
})
//   sequelize is a promise based library 
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// GET /api/users/1
// instead of findAll we use findOne
router.get('/:id', (req, res) => {
    // is equivalent to SELECT * FROM users WHERE id = 1 in MySQL
    User.findOne({
      attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        {
          model: Post,
          attributes: ['title'],
          through: Vote,
          as: 'voted_posts'
        }
      ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

// POST /api/users
router.post('/', (req, res) => {
     // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    //  we use create which is the same as Enter INTO user (username, email, password) VALUES ("lernantino", @lernantino, password 1234)
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/users/1
// updating user data
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
//   updata combines parameters of looking up data and creating data
// is the same as UPDATE usersSET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
// WHERE id = 1; in MySQL
  User.update(req.body, {
    // this enables the hooks option for the obeject
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    // the same as the DELETE Where method in mySQL
    User.destroy({
        where: {
          id: req.params.id
        }
      })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

// user route to log in sice we cant use an id because id is unkown to the user
// we use the post method so that we dont retrieve anything potentially sensitive
router.post('/login', (req, res) => {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    res.json({ user: dbUserData, message: 'You are now logged in!' });
  });
});

module.exports = router;