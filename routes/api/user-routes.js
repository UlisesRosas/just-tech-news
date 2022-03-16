const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
      // Access our User model and run .findAll() method) .findall() is equivalent to SELECT * FROM in mySQL
  User.findAll({
    // we want to hide this info from the user so we exclude the attribute
    attributes: { exclude: ['password'] 
  }
})
//   se2ualize is a promise based library 
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

module.exports = router;