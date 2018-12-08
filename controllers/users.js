const Joi = require('joi')
const moment = require('moment')
const userSchema = require('../schemas/user')

const { hashPasswordAsync, compareAsync } = require('../lib')

const {
  User,
  Expense,
} = require('../models')

const authController = require('./auth')
const { mail } = require('../services')

const userInclude = [
  {
    model: Expense,
    as: 'expenses',
    include: [
      'photos',
    ],
  },
  'sessions',
]

const userOrder = [
  ['sessions', 'in', 'DESC'],
]

const joiOptions = {
  stripUnknown: true,
}

module.exports = {
  async getAll(req, res) {
    // TODO: extract this into middleware? add authorization?
    const { roles } = req.query
    const query = {
      include: userInclude,
      order: userOrder,
    }
    if (roles) {
      const role = roles.split(',')
      // query by role, e.g. { role: ['admin', 'rep'] }
      query.where = { role }
    }
    const users = (await User.findAll(query)).map(el => {
      const user = el.get({ plain: true })
      user.bonus = getBonusFromUser(user)
      return user
    })
    res.json({
      success:true,
      users,
    })
  },

  async post(req, res) {
    // Validate request
    let user = await Joi.validate(req.body, userSchema.postMember, joiOptions)

    // create user
    user = await User.create(user)

    // extract keys
    const { email, role, id } = user

    // generate token for email verification
    const token = await authController.generateToken({email, role, id}, 'email')

    // send email to user so they can create the password
    // const sendgridResponse = await mail.sendVerificationEmail({email, role, token})

    res.json({
      success: true,
      // sendgridResponse,
      user,
    })
  },

  async getUserMiddleware(req, res, next) {
    const userId = req.params.userId ||  req.self.id
    const options = {
      include: userInclude,
      order: userOrder,
    }
    const user = await User.findById(userId, options)
    if (!user) {
      res.status = 404
      throw new Error('User not found')
    } else {
      req.user = user
      next()
    }
  },

  async userIsMemberMiddleware(req, res, next) {
    const { role } = req.user
    const userIsMember = role === 'admin' || role === 'rep'

    if (!userIsMember) {
      res.status = 404
      throw new Error('User not found')
    } else {
      next()
    }
  },

  async get(req, res) {
    const user = req.user.get({ plain: true })
    // get weekly hours
    user.weeklyHours = getWeeklyHoursFromUser(user)
    user.bonus = getBonusFromUser(user)
    res.json({
      success: true,
      user,
    })
  },

  async patch(req, res) {
    const update = await Joi.validate(req.body, userSchema.patchMember, joiOptions)

    const { password, oldPassword } = update

    if (password) {
      await compareAsync(oldPassword, req.user.password)
      update.password = await hashPasswordAsync(password)
    }

    const user = await req.user.update(update)
    res.json({
      success:true,
      user,
    })
  },

  delete(req, res) {
    res.json({
      success:true,
      user: req.user,
    })
  },
}

function getWeeklyHoursFromUser({ sessions }) {
  if (!sessions || !sessions.length) {
    return 0
  }

  const beginningOfWeek = moment().startOf('isoWeek')
  const now = moment()

  const isThisWeek = session => {
    const start = moment(session.in)
    return start.isBetween(beginningOfWeek, now)
  }
  const mapHours = el => el.hours
  const getSum = (acc, curr) => acc + curr

  const totalHours = sessions.filter(isThisWeek).map(mapHours).reduce(getSum, 0)

  return Math.floor(totalHours * 10) / 10
}

function getBonusFromUser({ scripts }) {
  if (!scripts || !scripts.length) {
    return 0
  } else {
    return 1
  }
}
