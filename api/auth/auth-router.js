const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware');

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await Users.add({ username, password: hash });

    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await Users.findBy({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `Welcome ${user.username}!` });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ message: 'logged out' });
      }
    });
  } else {
    res.status(200).json({ message: 'no session' });
  }
});

module.exports = router;