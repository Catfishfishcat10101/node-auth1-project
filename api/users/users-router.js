// api/users/users-router.js

const router = require('express').Router();
const Users = require('./users-model'); // Import your users model

// [GET] /api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await Users.find(); // Use your find method from the users model
    res.json(users);
  } catch(err) {
    next(err);
  }
});

module.exports = router;