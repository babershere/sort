const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const { hashPasswordAsync, compareAsync } = require('../lib')

const {
  User,
} = require('../models')

const Physician = User.scope('physician')

const authSchema = require('../schemas/auth')

const { mail } = require('../services')

const joiOptions = {
  stripUnknown: true,
}

const {
  JWT_SECRET,
  ADMIN_URL,
} = process.env

module.exports = {
  /* Authenticate jwt */
  async authorize(req, res, next) {
    const token = req.token
    try {
      const { user } = await authorizeToken(token, 'auth')
      req.self = user
      next()
    } catch (err) {
      res.status = 403
      req.errorHandler(err, res)
    }
  },

  /* Authenticate jwt with email type */
  async authorizeEmail(req, res, next) {
    const token = req.token
    const { user } = await authorizeToken(token, 'email')
    req.self = user
    next()
  },

  /* Authenticate jwt with create password type */
  async authorizeCreatePassword(req, res, next) {
    const token = req.token
    const { user } = await authorizeToken(token, 'createPassword')
    req.self = user
    next()
  },

  async login(req, res, next) {
    const { username, password } = await Joi.validate(req.body, authSchema.login, joiOptions)
    const query = {
      where: {
        [Op.or]: [
          { username },
          { email: username },
        ],
      },
    }

    const user = await User.findOne(query)
    if (!user) {
      const err = new Error('No user found with that email')
      err.status = 401
      throw err
    }

    if (!user.password) {
      const err = new Error('Password has not been set for user.')
      err.status = 401
      throw err
    }

    await compareAsync(password, user.password)

    // Determine the type of token to generate
    let tokenType
    // Check for physician first time login
    if (user.role === 'physician' && !user.verified) {
      tokenType = 'createPassword'
    } else {
      tokenType = 'auth'
    }

    await user.update({ lastLogin: Date.now() })

    const token = await generateToken(user, tokenType)

    res.json({
      success: true,
      message: 'User sucessfully logged on',
      token,
    })
  },

  async resendEmail(req, res) {
    const { email } = req.body
    const user = await User.findByEmail(email)
    const token = await generateToken(user, 'email')
    const { role } = user
    await mail.sendVerificationEmail({email, role, token})
    res.json({
      success: true,
      message: 'Email sent',
    })
  },

  async verifyEmail(req, res) {
    const userId = req.self.id
    const { password } = req.body
    let user = await User.findById(userId)
    user.password = await hashPasswordAsync(password)
    user.verified = true
    user = await user.save()
    const token = await generateToken(user, 'auth')
    res.json({
      success: true,
      token,
      user,
    })
  },

  async claimAccount(req, res) {
    const { id } = req.self
    const { password } = req.body
    const query = {
      where: {
        id,
        verified: false,
      },
    }
    let user = await Physician.findOne(query)
    user.password = await hashPasswordAsync(password)
    user.verified = true
    user = await user.save()
    const token = await generateToken(user, 'auth')
    res.json({
      success: true,
      token,
      user,
    })
  },

  verifyEmailLink(req, res) {
    const token = req.query.token
    const Location = `${ADMIN_URL}/login/create-password?token=${token}`
    res.writeHead(302, { Location })
    res.end()
  },


  /**
   * isAdmin - Checks if the user has admin role
   */
  isAdmin(req, res, next) {
    if (req.self.role !== 'admin') {
      res.status = 403
      throw new Error('User must be logged in as admin.')
    } else {
      next()
    }
  },


  /**
   * isRep - Checks if the user has rep role
   */
  isRep(req, res, next) {
    if (req.self.role !== 'rep') {
      res.status = 403
      throw new Error('User must be logged in as rep.')
    } else {
      next()
    }
  },


  /**
   * isMember - Checks if the user has either rep or admin role
   */
  isMember(req, res, next) {
    const { role } = req.self
    const userIsMember = role === 'admin' || role === 'rep'

    if (!userIsMember) {
      res.status = 403
      throw new Error('User must be logged in as rep.')
    } else {
      next()
    }
  },

  /**
   * isPhysician - Checks if the user has physician role
   */
  isPhysician(req, res, next) {
    if (req.self.role !== 'physician') {
      res.status = 403
      throw new Error('User must be logged in as physician.')
    } else {
      next()
    }
  },

  generateToken,

  authorizeToken,
}

function generateToken({ id, email, role }, type) {
  if (!type) {
    // [ 'auth', 'email' ]
    throw new Error('Must include token type')
  }

  const user = { id, email, role }
  const options = {
    expiresIn: '30d',
  }
  const payload = { user, type }
  return jwt.sign(payload, JWT_SECRET, options)
}

async function authorizeToken(token, type = 'auth') {
  if (!token) {
    const err = new Error(`Must provide token in 'x-access-token' header`)
    err.status = 401
    throw err
  }
  const payload = await jwt.verify(token, JWT_SECRET)
  if (!payload || !payload.user) {
    // check if user is in token
    throw new Error('Token does not contain user')
  } else if (payload.type !== type) {
    // check token type
    const err = new Error(`Wrong token type supplied. Requires token of type '${type}'`)
    err.status = 403
    throw err
  } else {
    // return the token payload
    return payload
  }
}
