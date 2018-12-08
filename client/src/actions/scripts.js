// Router
import { push } from 'react-router-redux'

// Types
import { scriptsTypes } from './types'

// Services
import { scripts } from '../services'

const {
  CREATE_SCRIPT,
  CREATE_SCRIPT_FAILURE,
  CREATE_SCRIPT_SUCCESS,
  SET_SCRIPT,
  GET_SCRIPT,
  PATIENT_CHANGE,
  MEDICATION_CHANGE,
  GET_SCRIPT_FAILURE,
  GET_SCRIPT_SUCCESS,
  PATCH_SCRIPT,
  PATCH_SCRIPT_FAILURE,
  PATCH_SCRIPT_SUCCESS,
  CREATE_NOTE,
  CREATE_NOTE_FAILURE,
  CREATE_NOTE_SUCCESS,
  CLEAR_ERRORS,
  CLEAR_STATE,
} = scriptsTypes

export const createScript = payload => dispatch => {
  const loginToken = window.localStorage.getItem("token");
  dispatch({
    type: CREATE_SCRIPT,
  })
  scripts.post('/api/scripts/create', payload, { headers: { "Authorization": "Bearer " + loginToken } })
    .then(res => onCreateScriptSuccess({dispatch, res}))
    .catch(err => onCreateScriptFailure({dispatch, err}))
}

function onCreateScriptSuccess({dispatch, res}) {
  console.log('createScript success', res);
  dispatch({
    type: CREATE_SCRIPT_SUCCESS,
  })
  dispatch(push('/scripts'))
}

function onCreateScriptFailure({dispatch, err}) {
  console.log('createScript failure', err);
  const payload = err.message || 'CreateScript Failed'
  window.alert(payload)
  dispatch({
    type: CREATE_SCRIPT_FAILURE,
    payload,
  })
}

export const setScript = payload => {
  return {
    type: SET_SCRIPT,
    payload,
  }
}

// Input

export const patientChange = payload => {
  return {
    type: PATIENT_CHANGE,
    payload,
  }
}

export const medicationChange = payload => {
  return {
    type: MEDICATION_CHANGE,
    payload,
  }
}

export const getScriptById = scriptId => (dispatch, getState) => {
  // check if a script has been set yet
  const { script } = getState().scripts
  if (script && script.id !== scriptId) {
    // clear it if it is not the same one
    console.log('clearing state');
    dispatch({
      type: CLEAR_STATE,
    })
  }

  dispatch({
    type: GET_SCRIPT,
  })
  scripts.getById(scriptId)
    .then(res => onGetScriptSuccess({dispatch, res}))
    .catch(err => onGetScriptFailure({dispatch, err}))
}

function onGetScriptSuccess({dispatch, res}) {
  console.log('getScript success', res);
  dispatch({
    type: GET_SCRIPT_SUCCESS,
    payload: res.script,
  })
}

function onGetScriptFailure({dispatch, err}) {
  console.log('getScript failure', err);
  const payload = err.message || 'GetScript Failed'
  window.alert(payload)
  dispatch({
    type: GET_SCRIPT_FAILURE,
    payload,
  })
  dispatch(push('/scripts'))
}

export const patchScriptById = (id, update) => (dispatch, getState) => {
  dispatch({
    type: PATCH_SCRIPT,
  })
  scripts.patchById(id, update)
    .then(res => onPatchScriptSuccess({dispatch, res}))
    .catch(err => onPatchScriptFailure({dispatch, err}))
}

function onPatchScriptSuccess({dispatch, res}) {
  console.log('patchScript success', res);
  dispatch({
    type: PATCH_SCRIPT_SUCCESS,
    payload: res.script,
  })
}

function onPatchScriptFailure({dispatch, err}) {
  console.log('patchScript failure', err)
  const payload = err.message || 'PatchScript Failed'
  window.alert(payload)
  dispatch({
    type: PATCH_SCRIPT_FAILURE,
    payload,
  })
}

export const createScriptNote = data => (dispatch, getState) => {
  dispatch({
    type: CREATE_NOTE,
  })

  const {
    scriptId,
    text,
  } = data

  scripts.postNoteById(scriptId, { text })
    .then(res => onCreateScriptNoteSuccess({dispatch, getState, res}))
    .catch(err => onCreateScriptNoteFailure({dispatch, err}))
}

function onCreateScriptNoteSuccess({dispatch, getState, res}) {
  console.log('createScriptNote success', res);
  const { note } = res

  // update the visits array on the script
  const { script } = getState().scripts
  const notes = [note, ...script.notes]
  script.notes = notes

  dispatch({
    type: CREATE_NOTE_SUCCESS,
    payload: { ...script },
  })
}

function onCreateScriptNoteFailure({dispatch, err}) {
  console.log('createScriptNote failure', err);
  dispatch({
    type: CREATE_NOTE_FAILURE,
    payload: err.message || 'CreateScriptNote Failed',
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
