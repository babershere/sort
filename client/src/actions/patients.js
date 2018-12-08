// Router
import { push } from 'react-router-redux'

// Types
import { patientsTypes } from './types'

// Services
import { patients } from '../services'

const {
  CREATE_PATIENT,
  CREATE_PATIENT_FAILURE,
  CREATE_PATIENT_SUCCESS,
  SET_PATIENT,
  GET_PATIENT,
  GET_PATIENT_FAILURE,
  GET_PATIENT_SUCCESS,
  PATCH_PATIENT,
  PATCH_PATIENT_FAILURE,
  PATCH_PATIENT_SUCCESS,
  CREATE_NOTE,
  CREATE_NOTE_FAILURE,
  CREATE_NOTE_SUCCESS,
  CLEAR_ERRORS,
  CLEAR_STATE,
} = patientsTypes

export const createPatient = payload => dispatch => {
  dispatch({
    type: CREATE_PATIENT,
  })
  patients.post(payload)
    .then(res => onCreatePatientSuccess({dispatch, res}))
    .catch(err => onCreatePatientFailure({dispatch, err}))
}

function onCreatePatientSuccess({dispatch, res}) {
  console.log('createPatient success', res);
  dispatch({
    type: CREATE_PATIENT_SUCCESS,
  })
  dispatch(push('/patients'))
}

function onCreatePatientFailure({dispatch, err}) {
  console.log('createPatient failure', err);
  const payload = err.message || 'CreatePatient Failed'
  window.alert(payload)
  dispatch({
    type: CREATE_PATIENT_FAILURE,
    payload,
  })
}

export const setPatient = payload => {
  return {
    type: SET_PATIENT,
    payload,
  }
}

export const getPatientById = patientId => (dispatch, getState) => {
  // check if a patient has been set yet
  const { patient } = getState().patients
  if (patient && patient.id !== patientId) {
    // clear it if it is not the same one
    console.log('clearing state');
    dispatch({
      type: CLEAR_STATE,
    })
  }

  dispatch({
    type: GET_PATIENT,
  })
  patients.getById(patientId)
    .then(res => onGetPatientSuccess({dispatch, res}))
    .catch(err => onGetPatientFailure({dispatch, err}))
}

function onGetPatientSuccess({dispatch, res}) {
  console.log('getPatient success', res);
  dispatch({
    type: GET_PATIENT_SUCCESS,
    payload: res.patient,
  })
}

function onGetPatientFailure({dispatch, err}) {
  console.log('getPatient failure', err);
  const payload = err.message || 'GetPatient Failed'
  window.alert(payload)
  dispatch({
    type: GET_PATIENT_FAILURE,
    payload,
  })
  dispatch(push('/patients'))
}

export const patchPatientById = (id, update) => (dispatch, getState) => {
  dispatch({
    type: PATCH_PATIENT,
  })
  patients.patchById(id, update)
    .then(res => onPatchPatientSuccess({dispatch, res}))
    .catch(err => onPatchPatientFailure({dispatch, err}))
}

function onPatchPatientSuccess({dispatch, res}) {
  console.log('patchPatient success', res);
  dispatch({
    type: PATCH_PATIENT_SUCCESS,
    payload: res.patient,
  })
}

function onPatchPatientFailure({dispatch, err}) {
  console.log('patchPatient failure', err)
  const payload = err.message || 'PatchPatient Failed'
  window.alert(payload)
  dispatch({
    type: PATCH_PATIENT_FAILURE,
    payload,
  })
}

export const createPatientNote = data => (dispatch, getState) => {
  dispatch({
    type: CREATE_NOTE,
  })

  const {
    patientId,
    text,
  } = data

  patients.postNoteById(patientId, { text })
    .then(res => onCreatePatientNoteSuccess({dispatch, getState, res}))
    .catch(err => onCreatePatientNoteFailure({dispatch, err}))
}

function onCreatePatientNoteSuccess({dispatch, getState, res}) {
  console.log('createPatientNote success', res);
  const { note } = res

  // update the visits array on the patient
  const { patient } = getState().patients
  const notes = [note, ...patient.notes]
  patient.notes = notes

  dispatch({
    type: CREATE_NOTE_SUCCESS,
    payload: { ...patient },
  })
}

function onCreatePatientNoteFailure({dispatch, err}) {
  console.log('createPatientNote failure', err);
  dispatch({
    type: CREATE_NOTE_FAILURE,
    payload: err.message || 'CreatePatientNote Failed',
  })
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  }
}

export const clearState = () => {
  return {
    type: CLEAR_STATE,
  }
}
