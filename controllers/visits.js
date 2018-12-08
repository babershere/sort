const Joi = require('joi')
const visitSchema = require('../schemas/visit')
const noteSchema = require('../schemas/note')

const {
  Visit,
  Note,
} = require('../models')

const joiOptions = {
  stripUnknown: true,
}

const noteIncludes = [
  'author',
]

const visitIncludes = [
  'physician',
  'rep',
  {
    model: Note,
    as: 'notes',
    include: noteIncludes,
  },
]

const visitOrder = [
  ['notes', 'created_at', 'DESC'],
]

module.exports = {
  async post(req, res) {
    // check if they are admin.
    // rep can only schedule a visit for themselves.
    if (req.self.role !== 'admin') {
      req.body.repId = req.self.id
    }

    let visit = await Joi.validate(req.body, visitSchema.post, joiOptions)

    visit = await Visit.create(visit)

    const options = {
      include: visitIncludes,
      order: visitOrder,
    }

    visit = await Visit.findById(visit.id, options)

    res.json({
      success: true,
      visit,
    })
  },

  async getVisitMiddleware(req, res) {
    const { visitId } = req.params
    const query = {
      where: { id: visitId },
      include: visitIncludes,
    }
    const visit = await Visit.findOne(query)
    req.visit = visit
    next()
  },

  get(req, res) {
    res.json({
      success: false,
      message: 'Not Implemented Yet'
    })
  },

  async getAll(req, res) {
    const query = {
      include: visitIncludes,
      order: visitOrder,
    }
    const visits = await Visit.findAll(query)

    res.json({
      success: true,
      visits,
    })
  },

  patch(req, res) {
    res.json({
      success: false,
      message: 'Not Implemented Yet'
    })
  },

  delete(req, res) {
    res.json({
      success: false,
      message: 'Not Implemented Yet'
    })
  },

  async postNote(req, res) {
    const userId = req.self.id
    const { visitId } = req.params
    let data = { ...req.body, userId, visitId }

    let note = await Joi.validate(data, noteSchema.post, joiOptions)

    note = await Note.create(note)

    note = await Note.findById(note.id, { include: noteIncludes })

    res.json({
      success: true,
      note,
    })
  },
}
