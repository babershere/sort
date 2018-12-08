const Joi = require('joi')
const patientSchema = require('../schemas/patient')
const noteSchema = require('../schemas/note')

const {
  Patient,
  Address,
  Insurance,
  Note,
} = require('../models')

const patientInclude = [
  'address',
  'primaryInsurance',
  'secondaryInsurance',
  {
    model: Note,
    as: 'notes',
    include: [
      'author',
    ],
  },
]

const noteIncludes = [
  'author',
]

const joiOptions = {
  stripUnknown: true,
}

module.exports = {
  /**
   * Gets patient scope to be used in request.
   * Depends on req.self.role
   */
  getPatientScopeMiddleware(req, res, next) {
    req.Patient = Patient.getScopeByRole(req.self.role)
    next()
  },

  async getPatientMiddleware(req, res, next) {
    const { patientId } = req.params
    const query = {
      where: {
        id: patientId,
      },
      include: patientInclude,
    }
    req.patient = await req.Patient.findOne(query)
    next()
  },

  async post(req, res) {
    let patient = await Joi.validate(req.body, patientSchema.post, joiOptions)

    patient = await req.Patient.create(patient)
    res.json({
      success: true,
      patient,
    })
  },

  get(req, res) {
    res.json({
      success: true,
      patient: req.patient,
    })
  },

  async getAll(req, res) {
    const query = {
      include: patientInclude,
    }
    const patients = await req.Patient.findAll(query)
    res.json({
      success: true,
      patients,
    })
  },

  async patch(req, res) {
    let {
      address,
      primaryInsurance,
      secondaryInsurance,
      ...update
    } = await Joi.validate(req.body, patientSchema.patch, joiOptions)

    const {
      addressId,
    } = req.patient

    // Update address
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

    // Update the insurances
    let insurances = [
      {
        original: req.patient.primaryInsurance,
        updated: primaryInsurance,
        action: 'setPrimaryInsurance',
      },
      {
        original: req.patient.secondaryInsurance,
        updated: secondaryInsurance,
        action: 'setSecondaryInsurance',
      },
    ]
    console.log(insurances);

    await Promise.all(insurances.map(insurance => {
      const { original, updated, action } = insurance
      if (original && updated) {
        console.log('updating', updated);
        return original.update(updated)
      } else if (updated) {
        updated.patientId = req.patient.id
        // create the insurance then update the patient record
        return Insurance.create(updated)
          .then(insurance => req.patient[action](insurance))
      }
    }))

    // Update patient
    await req.patient.update(update)

    // Get most recent instance
    const query = {
      where: { id: req.patient.id },
      include: patientInclude,
    }
    const patient = await req.Patient.findOne(query)

    res.json({
      success: true,
      patient,
    })
  },

  async postNote(req, res) {
    const userId = req.self.id
    const { patientId } = req.params
    const data = { ...req.body, userId, patientId }

    let note = await Joi.validate(data, noteSchema.post, joiOptions)

    note = await Note.create(note)

    note = await Note.findById(note.id, { include: noteIncludes })

    res.json({
      success: true,
      note,
    })
  },
}
