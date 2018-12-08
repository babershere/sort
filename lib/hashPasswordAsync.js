const bcrypt = require('bcrypt');

module.exports = val => {
  const password = val.trim()
  if (!password || password.length < 6) {
    const message = 'Must submit password with at least 6 characters'
    throw new Error(message)
  }
  return bcrypt.hash(password, 8)
}
