const Joi = require('joi')
const expenseSchema = require('../schemas/expense')

const {
  Expense,
  Attachment,
} = require('../models')

const expenseInclude = [
  {
    model: Attachment,
    as: 'photos',
  },
]

const joiOptions = {
  stripUnknown: true,
}

module.exports = {
  async getAll(req, res) {
    const userId = req.self.id

    const query = {
      where: { userId },
      include: expenseInclude
    }
    const expenses = await Expense.findAll(query)

    res.json({
      success: true,
      expenses,
    })
  },

  async post(req, res) {
    const userId = req.self.id
    let { photoIds, ...expense } = await Joi.validate({...req.body, userId}, expenseSchema.post, joiOptions)

    expense = await Expense.create(expense)

    expense = await expense.setPhotos(photoIds)

    res.json({
      success: true,
      expense,
    })
  },

  async getExpenseMiddleware(req, res, next) {
    const userId = req.params.userId || req.self.id
    const { expenseId } = req.params
    const query = {
      where: {
        id: expenseId,
        userId,
      },
      include: expenseInclude,
    }
    const expense = await Expense.findOne(query)
    if (!expense) {
      const err = new Error('Expense not found')
      err.status = 404
      throw err
    }
    req.expense = expense
    next()
  },

  get(req, res) {
    res.json({
      success: true,
      expense: req.expense,
    })
  },

  async patch(req, res) {
    const update = await Joi.validate(req.body, expenseSchema.patch, joiOptions)
    const expense = await req.expense.update(update)
    res.json({
      success: true,
      message: 'Expense Updated',
      expense,
    })
  },

  async patchStatus(req, res) {
    const update = await Joi.validate(req.body, expenseSchema.patchStatus, joiOptions)
    const expense = await req.expense.update(update)
    res.json({
      success: true,
      message: 'Expense Updated',
      expense,
    })
  },

  async bulkPatchStatus(req, res) {
    const { userId } = req.params
    const { expenseIds, ...update } = await Joi.validate(req.body, expenseSchema.bulkPatchStatus, joiOptions)

    const query = {
      where: {
        id: expenseIds,
        userId,
      },
      include: expenseInclude,
      returning: true,
    }

    const [count, expenses] = await Expense.update(update, query)

    res.json({
      success: true,
      message: `${count} Expenses Updated`,
      expenses,
    })
  },

  async delete(req, res) {
    await req.expense.destroy()
    res.json({
      success: true,
      message: 'Expense Deleted',
      expense: req.expense,
    })
  },
}
