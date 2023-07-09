const { HASH_ROUND } = require('../../secrets');
const User = require('../users/user-model');
const bcrypt = require('bcryptjs')

const usernameVarMi = async (req, res, next) => {
  const { username } = req.body
  const user = await User.getByFilter({ username: username })
  console.log("MESSAGE: ", user)
  if (!user) {
    res.status(401).json({ message: 'User tanımlı degil' })
  } else {
    //const hashedPassword = bcrypt.hashSync(user.password, HASH_ROUND);
    //req.hashedPassword = hashedPassword;
    req.user = user
    next()
  }
}

const usernameBostaMi = async (req, res, next) => {
  const { username, password } = req.body
  const user = await User.getByFilter({ username: username })
  if (user) {
    res.status(422).json({ message: "User zaten tanımlı" })
  } else {
    const hashedPassword = bcrypt.hashSync(password, HASH_ROUND);
    req.hashedPassword = hashedPassword;
    next()
  }
}

module.exports = { usernameVarMi, usernameBostaMi }