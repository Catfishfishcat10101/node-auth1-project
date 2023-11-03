const users = require('../users/users-model');

module.exports = {
  restricted,
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists
};

function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'You shall not pass!' });
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const existingUser = await users.findBy({ username: req.body.username });
    if (existingUser.length === 0) {
      next();
    } else {
      res.status(422).json({ message: 'Username taken' });
    }
  } catch (err) {
    next(err);
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const existingUser = await users.findBy({ username: req.body.username });
    if (existingUser.length > 0) {
      next();
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
}

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length <= 3) {
    res.status(422).json({ message: 'Password must be longer than 3 chars' });
  } else {
    next();
  }
}