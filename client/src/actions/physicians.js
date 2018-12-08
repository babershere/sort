// Router
import { push } from 'react-router-redux'

// Types
import { physiciansTypes } from './types'

// Services
import { physicians, visits } from '../services'

const {
  CREATE_PHYSICIAN,
  CREATE_PHYSICIAN_FAILURE,
  CREATE_PHYSICIAN_SUCCESS,
  SET_PHYSICIAN,
  GET_PHYSICIAN,
  GET_PHYSICIAN_FAILURE,
  GET_PHYSICIAN_SUCCESS,
  PATCH_PHYSICIAN,
  PATCH_PHYSICIAN_FAILURE,
  PATCH_PHYSICIAN_SUCCESS,
  CREATE_NOTE,
  CREATE_NOTE_SUCCESS,
  CREATE_NOTE_FAILURE,
  CLEAR_ERRORS,
  CLEAR_STATE,
} = physiciansTypes

export const createPhysician = payload => dispatch => {
  dispatch({
    type: CREATE_PHYSICIAN,
  })
  physicians.post(payload)
    .then(res => onCreatePhysicianSuccess({dispatch, res}))
    .catch(err => onCreatePhysicianFailure({dispatch, err}))
}

function onCreatePhysicianSuccess({dispatch, res}) {
  console.log('createPhysician success', res);
  dispatch({
    type: CREATE_PHYSICIAN_SUCCESS,
  })
  dispatch(push('/physicians'))
}

function onCreatePhysicianFailure({dispatch, err}) {
  console.log('createPhysician failure', err);
  const payload = err.message || 'CreatePhysician Failed'
  window.alert(payload)
  dispatch({
    type: CREATE_PHYSICIAN_FAILURE,
    payload,
  })
}

export const setPhysician = payload => {
  return {
    type: SET_PHYSICIAN,
    payload,
  }
}

export const getPhysicianById = physicianId => (dispatch, getState) => {
  // check if a physician has been set yet
  const { physician } = getState().physicians
  if (physician && physician.id !== physicianId) {
    // clear it if it is not the same one
    console.log('clearing state');
    dispatch({
      type: CLEAR_STATE,
    })
  }

  dispatch({
    type: GET_PHYSICIAN,
  })
  physicians.getById(physicianId)
    .then(res => onGetPhysicianSuccess({dispatch, res}))
    .catch(err => onGetPhysicianFailure({dispatch, err}))
}

function onGetPhysicianSuccess({dispatch, res}) {
  console.log('getPhysician success', res);
  dispatch({
    type: GET_PHYSICIAN_SUCCESS,
    payload: res.physician,
  })
}

function onGetPhysicianFailure({dispatch, err}) {
  console.log('getPhysician failure', err);
  const payload = err.message || 'GetPhysician Failed'
  window.alert(payload)
  dispatch({
    type: GET_PHYSICIAN_FAILURE,
    payload,
  })
  dispatch(push('/physicians'))
}

export const patchPhysicianById = (id, update) => (dispatch, getState) => {
  dispatch({
    type: PATCH_PHYSICIAN,
  })
  physicians.patchById(id, update)
    .then(res => onPatchPhysicianSuccess({dispatch, res}))
    .catch(err => onPatchPhysicianFailure({dispatch, err}))
}

function onPatchPhysicianSuccess({dispatch, res}) {
  console.log('getPhysician success', res);
  dispatch({
    type: PATCH_PHYSICIAN_SUCCESS,
    payload: res.physician,
  })
}

function onPatchPhysicianFailure({dispatch, err}) {
  console.log('patchPhysician failure', err);
  const payload = err.message || 'PatchPhysician Failed'
  window.alert(payload)
  dispatch({
    type: PATCH_PHYSICIAN_FAILURE,
    payload,
  })
}

export const createNote = data => (dispatch, getState) => {
  dispatch({
    type: CREATE_NOTE,
  })

  const {
    visitId,
    text,
  } = data

  visits.postNoteById(visitId, { text })
    .then(res => onCreateNoteSuccess({dispatch, getState, res}))
    .catch(err => onCreateNoteFailure({dispatch, err}))
}

function onCreateNoteSuccess({dispatch, getState, res}) {
  console.log('createNote success', res);
  const { note } = res
  // update the visits array on the physician

  const { physician } = getState().physicians
  const { visits } = physician
  const visit = visits.find(el => el.id === note.visitId)
  visit.notes = [...visit.notes, note]

  dispatch({
    type: CREATE_NOTE_SUCCESS,
    payload: { ...physician },
  })
}

function onCreateNoteFailure({dispatch, err}) {
  console.log('createNote failure', err);
  dispatch({
    type: CREATE_NOTE_FAILURE,
    payload: err.message || 'CreateNote Failed',
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
