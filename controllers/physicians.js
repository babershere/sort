const Joi = require('joi')
const userSchema = require('../schemas/user')

const { hashPasswordAsync } = require('../lib')

const {
  User,
  Note,
  Visit,
  Address,
} = require('../models')

const Physician = User.scope('physician')

const physicianInclude = [
  {
    model: Visit,
    as: 'visits',
    include: [
      'rep',
      {
        model: Note,
        as: 'notes',
        include: [
          'author',
        ],
      },
    ],
  },
  'address',
  'rep',
]

const physicianOrder = [
  ['visits', 'dateTime', 'DESC'],
  ['visits', 'notes', 'created_at', 'DESC'],
]

const joiOptions = {
  stripUnknown: true,
}

module.exports = {
  async getAll(req, res) {
    const query = {
      include: physicianInclude,
      order: physicianOrder,
    }
    const users = await Physician.findAll(query)
    res.json({
      success: true,
      users,
    })
  },

  async post(req, res) {
    // Validate request
    let user = await Joi.validate(req.body, userSchema.postPhysician, joiOptions)

    // create user
    user = await Physician.create(user)

    res.json({
      success: true,
      user,
    })
  },

  async getPhysicianMiddleware(req, res, next) {
    const { physicianId } = req.params
    if (!physicianId) {
      throw new Error('Must include physicianId')
    }

    const options = {
      include: physicianInclude,
      order: physicianOrder,
    }

    req.physician = await Physician.findById(physicianId, options)

    next()
  },

  async get(req, res) {
    const { physician } = req
    res.json({
      success: true,
      physician,
    })
  },

  async patch(req, res) {
    let { address, ...update } = await Joi.validate(req.body, userSchema.patchPhysician, joiOptions)

    const { addressId } = req.physician

    if (addressId) {
      const query = {
        where: { id: addressId },
      }
      if (address) {
        // patch address
        await Address.update(address, query)
      } else if (address === null) {
        // delete address
        await Address.destroy(query)
      }
    } else if (address) {
      // create address
      address = await Address.create(address)
      update.addressId = address.id
    }

    const { password } = update

    if (password) {
      update.password = await hashPasswordAsync(password)
    }

    // Update physician
    await req.physician.update(update)

    // Get most recent instance
    const query = {
      where: { id: req.physician.id },
      include: physicianInclude,
    }
    const physician = await Physician.findOne(query)

    res.json({
      success: true,
      message: 'Physician has been patched',
      physician,
      update,
    })
  },
}
