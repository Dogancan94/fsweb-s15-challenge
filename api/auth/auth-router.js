const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../secrets');
const { usernameVarMi, usernameBostaMi } = require('./auth-middleware');
const User = require('../users/user-model')

router.post('/register', usernameBostaMi, async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.insert({ username: username, password: req.hashedPassword })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.post('/login', usernameVarMi, (req, res) => {
  const { password } = req.body;
  if (req.user && bcrypt.compareSync(password, req.user.password)) {
    const payload = {
      id: req.user.id,
      username: req.user.username,
      password: req.user.password
    }

    const options = {
      expiresIn: '24h'
    }

    const token = jwt.sign(payload, JWT_SECRET, options)
    res.json({ message: `${req.user.username} geri geldi`, token: token })
  } else {
    res.status(401).json({ message: 'gecersiz kriter' })
  }
});

module.exports = router;
