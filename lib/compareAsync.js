const bcrypt = require('bcrypt')

/**
 * compareAsync
 * @return {string} [description]
 */
const compareAsync = (input, hash) => {
  return bcrypt.compare(input, hash).then(matched => {
    if (!matched) {
      const err = new Error('Password entered is incorrect.')
      err.status = 401
      throw err
    } else {
      return matched
    }
  })
}

module.exports = compareAsync
